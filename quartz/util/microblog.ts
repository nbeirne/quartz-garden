import { Root, RootContent, Element } from "hast"
import { toString as hastToString } from "hast-util-to-string"
import { VFile } from "vfile"
import { ProcessedContent, QuartzPluginData } from "../plugins/vfile"
import { FullSlug } from "./path"

const DATE_PREFIX_RE =
  /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?)(Z|[+-]\d{2}:?\d{2})?)?/

type SplitPost = {
  heading: Element
  children: RootContent[]
  date: Date
  hasTime: boolean
}

function parseHeadingDate(node: Element): { date: Date; hasTime: boolean } | null {
  const text = hastToString(node).trim()
  if (!text) return null
  const match = text.match(DATE_PREFIX_RE)
  if (!match) return null
  const hasTime = Boolean(match[2])
  const ms = Date.parse(match[0])
  if (isNaN(ms)) return null
  return { date: new Date(ms), hasTime }
}

function splitPosts(root: Root): SplitPost[] {
  const posts: SplitPost[] = []
  let current: SplitPost | null = null
  for (const child of root.children) {
    if (child.type === "element" && (child as Element).tagName === "h2") {
      const parsed = parseHeadingDate(child as Element)
      if (parsed) {
        current = {
          heading: child as Element,
          children: [],
          date: parsed.date,
          hasTime: parsed.hasTime,
        }
        posts.push(current)
        continue
      }
    }
    if (current) current.children.push(child)
  }
  return posts
}

function collectInlineTags(children: RootContent[]): string[] {
  const seen = new Set<string>()
  const walk = (nodes: ReadonlyArray<unknown>) => {
    for (const n of nodes) {
      if (!n || typeof n !== "object") continue
      const node = n as { type?: string; tagName?: string; properties?: any; children?: unknown[] }
      if (node.type === "element") {
        const cls = node.properties?.className
        if (node.tagName === "a" && Array.isArray(cls) && (cls as string[]).includes("tag-link")) {
          const name = hastToString(node as Element).trim()
          if (name) seen.add(name)
        }
        if (Array.isArray(node.children)) walk(node.children)
      }
    }
  }
  walk(children as unknown[])
  return Array.from(seen)
}

function extractText(children: RootContent[]): string {
  return hastToString({ type: "root", children } as Root)
}

function deriveTitle(children: RootContent[], date: Date): string {
  const text = extractText(children).trim().replace(/\s+/g, " ")
  if (!text) return date.toISOString().slice(0, 10)
  const maxChars = 30
  const maxWords = 8
  const words = text.split(" ")
  let truncated = words.slice(0, maxWords).join(" ")
  if (truncated.length > maxChars) {
    truncated = truncated.slice(0, maxChars).replace(/\s+\S*$/, "")
  }
  return truncated.length < text.length ? truncated + "…" : truncated
}

export function postSlugFor(parentSlug: FullSlug, headingId: string): FullSlug {
  const parts = parentSlug.split("/")
  if (parts[parts.length - 1] === "index") parts.pop()
  const base = parts.join("/")
  return (base ? `${base}/${headingId}` : headingId) as FullSlug
}

function synthesizePost(
  post: SplitPost,
  parent: VFile,
  parentSlug: FullSlug,
): ProcessedContent | null {
  const headingId = (post.heading.properties?.id as string | undefined) ?? undefined
  if (!headingId) return null
  if (post.children.length === 0) return null

  const slug = postSlugFor(parentSlug, headingId)
  const tags = collectInlineTags([post.heading, ...post.children])
  const title = deriveTitle(post.children, post.date)
  const text = extractText(post.children)
  const description = text.replace(/\s+/g, " ").trim().slice(0, 300)
  const subtree: Root = { type: "root", children: post.children }

  const parentData = parent.data as QuartzPluginData
  const vfile = new VFile("")
  vfile.data = {
    slug,
    relativePath: parentData.relativePath,
    filePath: parentData.filePath,
    frontmatter: { title, tags },
    dates: { created: post.date, modified: post.date, published: post.date },
    description,
    text,
    links: [],
    htmlAst: subtree,
    blocks: {},
    isMicroblogPost: true,
    microblogParentSlug: parentSlug,
    microblogHasTime: post.hasTime,
  } as QuartzPluginData

  return [subtree, vfile]
}

declare module "vfile" {
  interface DataMap {
    isMicroblogPost: boolean
    microblogParentSlug: FullSlug
    microblogHasTime: boolean
  }
}

export function expandMicroblogPosts(content: ProcessedContent[]): ProcessedContent[] {
  const result: ProcessedContent[] = []
  for (const item of content) {
    const [tree, vfile] = item
    if (vfile.data.frontmatter?.microblog !== true) {
      result.push(item)
      continue
    }

    const posts = splitPosts(tree as Root)
    if (posts.length === 0) {
      result.push(item)
      continue
    }

    // posts own their inline tags; prevent the parent index from double-listing on tag pages
    if (vfile.data.frontmatter) {
      vfile.data.frontmatter.tags = []
    }

    result.push(item)
    for (const post of posts) {
      const synthetic = synthesizePost(post, vfile, vfile.data.slug!)
      if (synthetic) result.push(synthetic)
    }
  }
  return result
}
