---
title: Webring
---

### the cool ring

The coolest webring. Why is it called that? It's a long story.

> [!spoiler]- Member Sites
> - https://moss.supply/
> - https://dylanbickers.com/
> - https://achilleas.org/
> - https://wq6e.com/

<div style="text-align: center">
	<br>
	<a href="/webring">the cool ring</a>
	<br>
	<div class="webring-nav">
	  <a href="https://wq6e.com/" class="webring-prev">← wq6e.com </a>
	  <span class="webring-separator">|</span>
	  <a href="#" class="webring-random" onclick="goToRandomSite(); return false;">Random Site</a>
	  <span class="webring-separator">|</span>
	  <a href="https://moss.supply/" class="webring-next">moss.supply →</a>
	</div>
</div>

<script>

const sites = [
  'https://moss.supply/',
  'https://dylanbickers.com/',
  'https://achilleas.org/',
		'https://wq6e.com/'
];

function goToRandomSite() {
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
