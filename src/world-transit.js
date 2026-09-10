import './styles/world-transit.css'

const root = document.querySelector('#world-app')

const transitMarkup = `
  <svg class="world-transit" viewBox="0 0 1000 566" preserveAspectRatio="none" aria-hidden="true">
    <g class="world-transit__active">
      <path class="world-transit__line world-transit__line--meridian" d="M165 520 C205 449 275 392 358 337 C423 294 458 239 448 184 C440 140 409 112 350 95" />
      <path class="world-transit__line world-transit__line--crown" d="M358 337 C454 358 548 350 626 317 C702 284 781 267 918 280" />
      <circle cx="358" cy="337" r="6"/><circle cx="350" cy="95" r="5"/><circle cx="626" cy="317" r="5"/><circle cx="868" cy="277" r="5"/>
    </g>
    <g class="world-transit__legacy">
      <path class="world-transit__line world-transit__line--old" d="M38 470 C103 446 169 441 230 454 C292 467 340 480 402 467" />
      <path class="world-transit__line world-transit__line--ridge" d="M626 317 C596 251 565 199 539 151 C522 118 512 88 510 54" />
      <circle cx="38" cy="470" r="5"/><circle cx="230" cy="454" r="5"/><circle cx="510" cy="54" r="5"/>
    </g>
    <g class="world-transit__blind">
      <path d="M24 494 C82 474 137 471 184 486 C211 496 228 512 235 535" />
      <path d="M455 78 C492 62 531 60 570 69" />
    </g>
  </svg>
  <div class="world-transit__labels" aria-hidden="true">
    <span class="world-transit-label world-transit-label--meridian">MERIDIAN SPINE</span>
    <span class="world-transit-label world-transit-label--crown">CROWN LOOP</span>
    <span class="world-transit-label world-transit-label--old">OLD TRANSIT BRANCH</span>
    <span class="world-transit-label world-transit-label--ridge">NORTH RIDGE SPUR</span>
  </div>
`

const networkStrip = `
  <div class="world-transit-strip" aria-label="Vesper transit network legend">
    <article><span>ACTIVE NETWORK</span><strong>MERIDIAN SPINE / CROWN LOOP</strong><p>High-capacity corridors with dense HALO integration, predictive routing and continuous civic visibility.</p></article>
    <article><span>LEGACY NETWORK</span><strong>OLD TRANSIT BRANCH / NORTH RIDGE SPUR</strong><p>Older infrastructure still connected to the city, but less uniformly upgraded and less seamlessly observed.</p></article>
    <article><span>BLIND-SPOT CORRIDORS</span><strong>SERVICE / MAINTENANCE LAYERS</strong><p>Not invisible territory — simply places where fragmented infrastructure creates gaps between what HALO can observe and what it can confidently interpret.</p></article>
  </div>
`

const initialize = () => {
  if (!root || root.querySelector('.world-transit')) return

  const insert = () => {
    const canvas = root.querySelector('[data-world-map-canvas]')
    const shell = root.querySelector('.world-map-shell')
    if (!canvas || !shell || root.querySelector('.world-transit')) return false

    const cityBase = canvas.querySelector('.world-map-basemap')
    if (cityBase) cityBase.insertAdjacentHTML('afterend', transitMarkup)
    else canvas.insertAdjacentHTML('beforeend', transitMarkup)

    shell.insertAdjacentHTML('afterend', networkStrip)

    const legend = canvas.querySelector('.world-map-canvas__legend span:first-child')
    if (legend) legend.insertAdjacentHTML('beforeend', '<i class="world-map-key world-map-key--transit"></i>TRANSIT')
    return true
  }

  if (insert()) return
  const observer = new MutationObserver(() => {
    if (!insert()) return
    observer.disconnect()
  })
  observer.observe(root,{ childList:true, subtree:true })
  window.setTimeout(() => observer.disconnect(),4000)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
