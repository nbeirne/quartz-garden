import { QuartzTransformerPlugin } from "../types"
import { webringConfig } from "../../data/webring"

function generateSpoilerMd(): string {
  const sites = webringConfig.memberSites
  const items = sites.map((s) => `- [${s.name}](${s.url})`).join("\n")
  return `> [!spoiler]- Member Sites\n${items.split("\n").map((l) => `> ${l}`).join("\n")}`
}

export const WebringMembers: QuartzTransformerPlugin = () => ({
  name: "WebringMembers",
  textTransform(_ctx, src) {
    const spoilerMd = generateSpoilerMd()
    return src.replace(/\{\{webring_members\}\}/g, spoilerMd)
  },
})
