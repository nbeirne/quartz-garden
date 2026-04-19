// @ts-ignore
import script from "./scripts/sortableTable.inline"
import styles from "./styles/sortableTable.scss"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const SortableTables: QuartzComponent = () => null

SortableTables.afterDOMLoaded = script
SortableTables.css = styles

export default (() => SortableTables) satisfies QuartzComponentConstructor
