---
title: Webring
---

This site is part of a webring — a collection of personal blogs and websites connected by navigation links. Webrings are a way to discover other folks writing on the indie web.


> [!spoiler]- Member Sites
> - https://moss.supply/
> - https://dylanbickers.com/
> - https://achilleas.org/

## Navigation

<div class="webring-nav">
  <a href="https://achilleas.org/" class="webring-prev">← Previous Site</a>
  <span class="webring-separator">|</span>
  <a href="#" class="webring-random" onclick="goToRandomSite(); return false;">Random Site</a>
  <span class="webring-separator">|</span>
  <a href="https://moss.supply/" class="webring-next">Next Site →</a>
</div>

<script>

const sites = [
  'https://moss.supply/',
  'https://dylanbickers.com/',
  'https://achilleas.org/'
];

function goToRandomSite() {
  const sites = [
    'https://moss.supply/',
    'https://dylanbickers.com/',
    'https://achilleas.org/'
  ];
  // Filter out current site to avoid redirecting to self
  const currentSite = window.location.origin;
  const otherSites = sites.filter(site => !currentSite.includes(new URL(site).hostname));
  
  if (otherSites.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherSites.length);
    window.location.href = otherSites[randomIndex];
  } else {
    // If all sites are filtered out, pick from all sites
    const randomIndex = Math.floor(Math.random() * sites.length);
    window.location.href = sites[randomIndex];
  }
}
</script>
