import './styles/world-transit.css'

const root = document.querySelector('#world-app')

const transitMarkup = `
  <svg class="world-transit" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
    <g class="world-transit__active">
      <path class="world-transit__line world-transit__line--meridian" d="M165 560 C225 470 310 405 405 337 S505 205 420 135 S295 105 245 95" />
      <path class="world-transit__line world-transit__line--crown" d="M405 337 C535 345 625 330 690 275 S790 225 900 245" />
      <circle cx="405" cy="337" r="6"/><circle cx="420" cy="135" r="5"/><circle cx="690" cy="275" r="5"/><circle cx="900" cy="245" r="5"/>
    </g>
    <g class="world-transit__legacy">
      <path class="world-transit__line world-transit__line--old" d="M120 520 C170 470 230 455 300 470 S420 500 525 470 S620 420 705 405" />
      <path class="world-transit__line world-transit__line--ridge" d="M690 275 C735 215 780 160 825 95 S895 55 945 60" />
      <circle cx="120" cy="520" r="5"/><circle cx="300" cy="470" r="5"/><circle cx="825" cy="95" r="5"/>
    </g>
    <g class="world-transit__blind">
      <path d="M70 455 C125 430 175 440 215 480 S240 545 205 575" />
      <path d="M755 120 C800 100 850 102 885 125" />
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

    const routes = canvas.querySelector('.world-map-canvas__routes')
    if (routes) routes.insertAdjacentHTML('afterend', transitMarkup)
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
