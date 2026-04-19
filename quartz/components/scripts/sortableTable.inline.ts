const SORTABLE_SELECTOR = "table.sortable, article[data-sortable-tables] table"

type SortDir = "asc" | "desc"

function getCellValue(cell: HTMLTableCellElement): string {
  return (cell.dataset.sortValue ?? cell.textContent ?? "").trim()
}

const numericRegex = /^-?[\d,]*\.?\d+%?$/

function compareValues(a: string, b: string): number {
  if (a === b) return 0
  if (a === "") return 1
  if (b === "") return -1

  if (numericRegex.test(a) && numericRegex.test(b)) {
    const aNum = parseFloat(a.replace(/,/g, "").replace(/%$/, ""))
    const bNum = parseFloat(b.replace(/,/g, "").replace(/%$/, ""))
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
  }

  const aDate = Date.parse(a)
  const bDate = Date.parse(b)
  if (!isNaN(aDate) && !isNaN(bDate)) return aDate - bDate

  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}

function sortRows(tbody: HTMLTableSectionElement, colIdx: number, dir: SortDir) {
  const rows = Array.from(tbody.rows)
  rows.sort((r1, r2) => {
    const a = getCellValue(r1.cells[colIdx])
    const b = getCellValue(r2.cells[colIdx])
    const cmp = compareValues(a, b)
    return dir === "asc" ? cmp : -cmp
  })
  const frag = document.createDocumentFragment()
  for (const r of rows) frag.appendChild(r)
  tbody.appendChild(frag)
}

function applyFilter(tbody: HTMLTableSectionElement, query: string) {
  const q = query.trim().toLowerCase()
  for (const row of Array.from(tbody.rows)) {
    const text = (row.textContent ?? "").toLowerCase()
    row.style.display = !q || text.includes(q) ? "" : "none"
  }
}

function enhanceTable(table: HTMLTableElement) {
  if (table.dataset.sortableEnhanced === "true") return
  const thead = table.tHead
  const tbody = table.tBodies[0]
  if (!thead || !tbody || thead.rows.length === 0) return
  table.dataset.sortableEnhanced = "true"
  table.classList.add("sortable")

  const wrapper = document.createElement("div")
  wrapper.className = "sortable-table-wrapper"

  const controls = document.createElement("div")
  controls.className = "sortable-table-controls"

  const input = document.createElement("input")
  input.type = "search"
  input.placeholder = "Filter rows…"
  input.className = "sortable-table-filter"
  input.setAttribute("aria-label", "Filter table rows")
  const onInput = () => applyFilter(tbody, input.value)
  input.addEventListener("input", onInput)
  window.addCleanup(() => input.removeEventListener("input", onInput))

  controls.appendChild(input)

  const parent = table.parentNode
  if (!parent) return
  parent.insertBefore(wrapper, table)
  wrapper.appendChild(controls)
  wrapper.appendChild(table)

  const headerRow = thead.rows[thead.rows.length - 1]
  const state: { col: number; dir: SortDir } = { col: -1, dir: "asc" }

  const cleanupListeners: Array<() => void> = []
  Array.from(headerRow.cells).forEach((th, idx) => {
    if (th.dataset.sortDisable === "true") return
    th.classList.add("sortable-col")
    th.setAttribute("role", "button")
    th.setAttribute("tabindex", "0")

    const onClick = () => {
      const dir: SortDir = state.col === idx && state.dir === "asc" ? "desc" : "asc"
      state.col = idx
      state.dir = dir
      sortRows(tbody, idx, dir)
      for (const h of Array.from(headerRow.cells)) {
        h.classList.remove("sort-asc", "sort-desc")
      }
      th.classList.add(dir === "asc" ? "sort-asc" : "sort-desc")
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onClick()
      }
    }

    th.addEventListener("click", onClick)
    th.addEventListener("keydown", onKey)
    cleanupListeners.push(() => {
      th.removeEventListener("click", onClick)
      th.removeEventListener("keydown", onKey)
    })
  })

  window.addCleanup(() => {
    for (const fn of cleanupListeners) fn()
  })
}

function setup() {
  document.querySelectorAll<HTMLTableElement>(SORTABLE_SELECTOR).forEach(enhanceTable)
}

document.addEventListener("nav", setup)
