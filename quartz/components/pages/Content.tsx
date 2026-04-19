import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import MicroblogTimeline from "../MicroblogTimeline"

const Microblog = MicroblogTimeline()

const Content: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  if (fileData.frontmatter?.microblog === true) {
    return <Microblog {...props} />
  }
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  const sortableTables = fileData.frontmatter?.sortableTables === true
  return (
    <article class={classString} data-sortable-tables={sortableTables ? "true" : undefined}>
      {content}
    </article>
  )
}

Content.css = Microblog.css

export default (() => Content) satisfies QuartzComponentConstructor
