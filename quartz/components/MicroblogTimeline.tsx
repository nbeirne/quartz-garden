import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { htmlToJsx } from "../util/jsx"
import { Date as DateEl } from "./Date"
import { ValidLocale } from "../i18n"
import style from "./styles/microblogTimeline.scss"
import { toString as hastToString } from "hast-util-to-string"
import { Root, RootContent, Element } from "hast"
import { FullSlug, resolveRelative } from "../util/path"
import { postSlugFor } from "../util/microblog"
import { MicroblogPost } from "./MicroblogPost"

interface TagLink {
  name: string
  href: string
}

interface Post {
  date: Date
  hasTime: boolean
  headingId?: string
  children: RootContent[]
  tags: TagLink[]
}

const DATE_PREFIX_RE =
  /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?)(Z|[+-]\d{2}:?\d{2})?)?/

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

function collectTagLinks(roots: Array<RootContent | Element>): TagLink[] {
  const seen = new Map<string, TagLink>()
  const walk = (nodes: ReadonlyArray<unknown>) => {
    for (const n of nodes) {
      if (!n || typeof n !== "object") continue
      const node = n as { type?: string; tagName?: string; properties?: any; children?: unknown[] }
      if (node.type === "element") {
        const cls = node.properties?.className
        if (
          node.tagName === "a" &&
          Array.isArray(cls) &&
          (cls as string[]).includes("tag-link")
        ) {
          const href = (node.properties?.href as string) ?? ""
          const name = hastToString(node as Element).trim()
          if (href && !seen.has(href)) seen.set(href, { name, href })
        }
      }
      if (Array.isArray(node.children)) walk(node.children)
    }
  }
  walk(roots)
  return Array.from(seen.values())
}

function formatDateTime(d: Date, locale: ValidLocale = "en-US"): string {
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default (() => {
  const MicroblogTimeline: QuartzComponent = ({
    cfg,
    fileData,
    tree,
  }: QuartzComponentProps) => {
    const root = tree as Root
    const preface: RootContent[] = []
    const posts: Post[] = []
    let current: Post | null = null

    const headings: Array<Element | null> = []
    for (const child of root.children) {
      if (child.type === "element" && child.tagName === "h2") {
        const parsed = parseHeadingDate(child)
        if (parsed) {
          const id = (child.properties?.id as string | undefined) ?? undefined
          current = {
            date: parsed.date,
            hasTime: parsed.hasTime,
            headingId: id,
            children: [],
            tags: [],
          }
          headings.push(child)
          posts.push(current)
          continue
        }
      }
      if (current) {
        current.children.push(child)
      } else {
        preface.push(child)
      }
    }

    posts.forEach((post, i) => {
      const heading = headings[i]
      post.tags = collectTagLinks(heading ? [heading, ...post.children] : post.children)
    })

    posts.sort((a, b) => b.date.getTime() - a.date.getTime())

    const prefaceJsx =
      preface.length > 0
        ? htmlToJsx(fileData.filePath!, { type: "root", children: preface } as Root)
        : null

    return (
      <article class="popover-hint">
        {prefaceJsx}
        {posts.length === 0 ? (
          <p class="microblog-empty">No posts yet.</p>
        ) : (
          <ul class="section-ul">
            {posts.map((post) => {
              const bodyJsx = htmlToJsx(fileData.filePath!, {
                type: "root",
                children: post.children,
              } as Root)
              const permalinkHref = post.headingId
                ? resolveRelative(
                    fileData.slug as FullSlug,
                    postSlugFor(fileData.slug as FullSlug, post.headingId),
                  )
                : undefined
              const dateEl = post.hasTime ? (
                <time datetime={post.date.toISOString()}>
                  {formatDateTime(post.date, cfg.locale)}
                </time>
              ) : (
                <DateEl date={post.date} locale={cfg.locale} />
              )
              return (
                <MicroblogPost
                  id={post.headingId}
                  permalinkHref={permalinkHref}
                  dateEl={dateEl}
                  tags={post.tags}
                  bodyJsx={bodyJsx}
                />
              )
            })}
          </ul>
        )}
      </article>
    )
  }

  MicroblogTimeline.css = style
  return MicroblogTimeline
}) satisfies QuartzComponentConstructor
