---
title: Hello
---
Welcome to my digital garden. I don't know what will go here. For now its a place where I put things which I am thinking about.

Here are a few projects I have done:
- Soup. monthly social gatherings of people.
- Many different [Urban completionism](Macroblog/Urban-Completionism) projects.
- Modular synthesis. This is a private practice, and does not get posted online.
- [[Spoiler Free Toronto]]
- [Dérive](https://walk.lexicondal.com) postering.
- I [self host](Macroblog/I-am-not-a-homelabber.).
- I'm part of a [webring](webring).



<div style="text-align: center">
    <br>
    <a href="/webring">the cool ring</a>
    <br>
    <div class="webring-nav">
      <a href="https://achilleas.org/" class="webring-prev">← achilleas.org</a>
      <span class="webring-separator">|</span>
      <a href="#" class="webring-random" onclick="goToRandomSite(); return false;">Random Site</a>
      <span class="webring-separator">|</span>
      <a href="https://moss.supply/" class="webring-next">moss.supply →</a>
    </div>
</div>

<script>
function goToRandomSite() {
  const sites = [
    'https://moss.supply/',
    'https://dylanbickers.com/',
    'https://achilleas.org/'
  ];
  const currentSite = window.location.origin;
  const otherSites = sites.filter(site => !currentSite.includes(new URL(site).hostname));
  
  if (otherSites.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherSites.length);
    window.location.href = otherSites[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * sites.length);
    window.location.href = sites[randomIndex];
  }
}
</script>
