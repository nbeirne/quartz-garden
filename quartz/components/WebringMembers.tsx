import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { webringConfig } from "../data/webring"

export default (() => {
  const WebringMembers: QuartzComponent = () => {
    return (
      <div class="webring-members">
        <p>
          {webringConfig.memberSites.map((site, i) => (
            <>
              <a href={site.url}>{site.name}</a>
              {i < webringConfig.memberSites.length - 1 && " · "}
            </>
          ))}
        </p>
      </div>
    )
  }

  return WebringMembers
}) satisfies QuartzComponentConstructor
