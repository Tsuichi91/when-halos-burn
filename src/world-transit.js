import './styles/world-transit.css'

const root = document.querySelector('#world-app')

const transitMarkup = `
  <svg class="world-transit" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
    <g class="world-transit__active">
      <path class="world-transit__line world-transit__line--meridian" d="M186 610 C215 526 285 451 378 373 C443 319 475 251 458 179 C446 128 394 98 286 93" />
      <path class="world-transit__line world-transit__line--crown" d="M378 373 C510 391 607 365 689 321 C759 283 835 266 970 276" />
      <circle cx="378" cy="373" r="6"/><circle cx="286" cy="93" r="5"/><circle cx="689" cy="321" r="5"/><circle cx="900" cy="272" r="5"/>
    </g>
    <g class="world-transit__legacy">
      <path class="world-transit__line world-transit__line--old" d="M42 525 C108 501 171 491 238 500 C323 512 386 529 474 500 C567 469 624 443 690 430" />
      <path class="world-transit__line world-transit__line--ridge" d="M689 321 C748 274 792 226 823 167 C855 108 903 70 970 58" />
      <circle cx="42" cy="525" r="5"/><circle cx="238" cy="500" r="5"/><circle cx="823" cy="167" r="5"/>
    </g>
    <g class="world-transit__blind">
      <path d="M30 552 C88 528 143 520 190 536 C221 547 237 571 226 603" />
      <path d="M760 112 C808 88 858 88 904 111" />
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

    const cityBase = canvas.querySelector('.world-map-citybase')
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
