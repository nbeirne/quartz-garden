import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface WebringConfig {
  previous: { name: string; url: string }
  next: { name: string; url: string }
  ring: { name: string; slug: string }
  memberSites: { name: string; url: string }[]
}

interface Options {
  links: Record<string, string>
  webring?: WebringConfig
}

export default ((opts?: Options) => {
  const webring = opts?.webring

  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        {webring && (
          <div class="webring-nav-wrapper">
            <div class="webring-nav">
              <a href={webring.previous.url} class="webring-prev">&larr;{webring.previous.name}</a>
              <span class="webring-separator">|</span>
              <a href="#" class="webring-random" onClick={(e) => {
                e.preventDefault()
                if (typeof window !== "undefined") {
                  const sites = webring.memberSites.map((s) => s.url)
                  const currentSite = window.location.origin
                  const otherSites = sites.filter((site: string) => !currentSite.includes(new URL(site).hostname))
                  if (otherSites.length > 0) {
                    const randomIndex = Math.floor(Math.random() * otherSites.length)
                    window.location.href = otherSites[randomIndex]
                  } else {
                    const randomIndex = Math.floor(Math.random() * sites.length)
                    window.location.href = sites[randomIndex]
                  }
                }
              }}>random</a>
              <span class="webring-separator">|</span>
              <a href={`/${webring.ring.slug}`}>{webring.ring.name}</a>
              <span class="webring-separator">|</span>
              <a href={webring.next.url} class="webring-next">{webring.next.name}&rarr;</a>
            </div>
          </div>
        )}
        <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> &copy; {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
