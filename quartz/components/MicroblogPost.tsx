import { JSX } from "preact"
import style from "./styles/microblogTimeline.scss"

export type MicroblogTag = { name: string; href: string }

export type MicroblogPostProps = {
  id?: string
  permalinkHref?: string
  dateEl: JSX.Element
  tags: MicroblogTag[]
  bodyJsx: JSX.Element | null | undefined
}

export function MicroblogPost({ id, permalinkHref, dateEl, tags, bodyJsx }: MicroblogPostProps) {
  return (
    <li class="section-li microblog-entry" id={id}>
      <div class="section">
        <p class="meta">
          {permalinkHref ? (
            <a class="microblog-permalink" href={permalinkHref}>
              {dateEl}
            </a>
          ) : (
            dateEl
          )}
        </p>
        <div class="desc microblog-body">{bodyJsx}</div>
        <ul class="tags">
          {tags.map((tag) => (
            <li>
              <a class="internal tag-link" href={tag.href}>
                {tag.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export const microblogPostStyle = style
