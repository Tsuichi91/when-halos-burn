import './styles/world-map.css'

const root = document.querySelector('#world-app')

const nodes = [
  {
    id:'MAP-01', title:'HALO HEADQUARTERS', short:'HALO HQ', affiliation:'HALO', role:'CIVIC AUTHORITY / CONTROL GRID', x:64, y:30,
    image:'./images/world/halo-headquarters.png',
    body:'The public face of HALO’s security architecture: visible, ordered and central to Vesper’s civic authority.',
    chapter:'03', chapterLabel:'HOLD THE LINE'
  },
  {
    id:'MAP-02', title:'HALO CORE', short:'CORE', affiliation:'HALO', role:'SEALED ARCHIVE / CENTRAL SYSTEM', x:70, y:43,
    image:'./images/archive/locations/halo-core.png',
    body:'The sealed institutional heart of HALO. The complete Blackout archive survives here behind controlled access.',
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'MAP-03', title:'BORDER DISTRICT', short:'BORDER', affiliation:'CIVIC', role:'FIRST CONTACT / CONTACT ZONE', x:40, y:54,
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'The district where Jiwon and Taeyun first meet in 2164 and the story’s clean Hero/Villain line immediately begins to fail.',
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'MAP-04', title:'THE OBSERVATORY', short:'OBSERVATORY', affiliation:'NEUTRAL', role:'NEUTRAL GROUND / RECURRING LOCATION', x:79, y:18,
    image:'./images/archive/locations/observatory.png',
    body:'A space outside either faction’s full control. Repeated voluntary meetings turn it from neutral ground into shared memory.',
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'MAP-05', title:'ECLIPSE HUB', short:'ECLIPSE HUB', affiliation:'ECLIPSE', role:'SHADOW GRID / OLD TRANSIT', x:27, y:74,
    image:'./images/world/eclipse-headquarters.png',
    body:'A covert operations hub embedded in Vesper’s older transit infrastructure and the blind spots HALO no longer treats as central.',
    chapter:'02', chapterLabel:'NO SAINT'
  }
]

const filters = ['ALL','HALO','ECLIPSE','NEUTRAL','CIVIC']
let selectedId = nodes[2].id
let activeFilter = 'ALL'

const mapMarkup = () => `
  <section class="world-map-section" id="city-map" aria-labelledby="world-map-title">
    <header class="world-map-section__head">
      <div><span>VESPER CITY / CARTOGRAPHIC LAYER</span><h2 id="world-map-title">INTERACTIVE CITY MAP</h2></div>
      <p>A schematic view of the locations that matter to the story. Relative placement is intentional; exact city geography remains open for future worldbuilding.</p>
    </header>

    <div class="world-map-shell">
      <div class="world-map-canvas" data-world-map-canvas>
        <div class="world-map-canvas__grid" aria-hidden="true"></div>
        <svg class="world-map-canvas__routes" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
          <path d="M70 470 C235 430 300 330 405 336 S595 410 710 272 S880 118 958 112" />
          <path d="M95 190 C250 205 318 270 410 338 S590 385 704 268 S842 216 940 250" />
          <path d="M235 585 C260 470 320 402 405 336 S530 235 645 188 S820 120 918 54" />
          <circle cx="650" cy="205" r="112" />
          <circle cx="650" cy="205" r="164" />
        </svg>
        <div class="world-map-canvas__zones" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        ${nodes.map((node) => `
          <button class="world-map-marker" type="button" data-map-node="${node.id}" data-affiliation="${node.affiliation}" style="--x:${node.x}%;--y:${node.y}%" aria-label="Show ${node.title}">
            <span class="world-map-marker__pulse"></span><i></i><strong>${node.short}</strong><small>${node.id}</small>
          </button>`).join('')}
        <div class="world-map-canvas__legend"><span>VESPER NETWORK / 2164</span><span>SCHEMATIC / NOT TO SCALE</span></div>
      </div>

      <aside class="world-map-panel" aria-live="polite">
        <div class="world-map-panel__filters" aria-label="Map filters">${filters.map((filter) => `<button type="button" data-map-filter="${filter}" class="${filter === activeFilter ? 'is-active' : ''}">${filter}</button>`).join('')}</div>
        <div class="world-map-panel__art"><img src="" alt="" data-map-image /><div aria-hidden="true"></div></div>
        <div class="world-map-panel__meta"><span data-map-id></span><span data-map-affiliation></span></div>
        <small data-map-role></small>
        <h3 data-map-title></h3>
        <p data-map-body></p>
        <div class="world-map-panel__actions"><a data-map-chapter href="#">OPEN STORY CHAPTER <i>↗</i></a><a href="./archive.html">OPEN ARCHIVE <i>↗</i></a></div>
        <div class="world-map-panel__list" aria-label="Mapped locations">${nodes.map((node) => `<button type="button" data-map-list="${node.id}" data-affiliation="${node.affiliation}"><span>${node.id}</span><strong>${node.title}</strong></button>`).join('')}</div>
      </aside>
    </div>
  </section>`

const selectedNode = () => nodes.find((node) => node.id === selectedId) || nodes[0]

const syncPanel = (focusMarker = false) => {
  const node = selectedNode()
  const set = (selector,value) => { const target = root.querySelector(selector); if (target) target.textContent = value }
  set('[data-map-id]',node.id)
  set('[data-map-affiliation]',node.affiliation)
  set('[data-map-role]',node.role)
  set('[data-map-title]',node.title)
  set('[data-map-body]',node.body)
  const image = root.querySelector('[data-map-image]')
  if (image) { image.src = node.image; image.alt = node.title }
  const chapter = root.querySelector('[data-map-chapter]')
  if (chapter) { chapter.href = `./chapter.html?chapter=${node.chapter}`; chapter.firstChild.textContent = `${node.chapterLabel} ` }
  root.querySelectorAll('[data-map-node],[data-map-list]').forEach((item) => item.classList.toggle('is-selected', (item.dataset.mapNode || item.dataset.mapList) === node.id))
  if (focusMarker) root.querySelector(`[data-map-node="${node.id}"]`)?.focus({ preventScroll:true })
}

const applyFilter = (filter) => {
  activeFilter = filter
  root.querySelectorAll('[data-map-filter]').forEach((button) => button.classList.toggle('is-active', button.dataset.mapFilter === filter))
  root.querySelectorAll('[data-map-node],[data-map-list]').forEach((item) => {
    const visible = filter === 'ALL' || item.dataset.affiliation === filter
    item.hidden = !visible
  })
  const current = selectedNode()
  if (filter !== 'ALL' && current.affiliation !== filter) {
    const first = nodes.find((node) => node.affiliation === filter)
    if (first) selectedId = first.id
  }
  syncPanel()
}

const initialize = () => {
  if (!root) return
  const vesper = root.querySelector('#vesper-city')
  if (!vesper || root.querySelector('#city-map')) return
  vesper.insertAdjacentHTML('afterend', mapMarkup())

  root.addEventListener('click', (event) => {
    const marker = event.target.closest('[data-map-node]')
    if (marker) { selectedId = marker.dataset.mapNode; syncPanel(); return }
    const listItem = event.target.closest('[data-map-list]')
    if (listItem) { selectedId = listItem.dataset.mapList; syncPanel(true); return }
    const filter = event.target.closest('[data-map-filter]')
    if (filter) applyFilter(filter.dataset.mapFilter)
  })

  root.querySelector('[data-world-map-canvas]')?.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return
    const visible = nodes.filter((node) => activeFilter === 'ALL' || node.affiliation === activeFilter)
    const index = Math.max(0, visible.findIndex((node) => node.id === selectedId))
    const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1
    selectedId = visible[(index + delta + visible.length) % visible.length].id
    event.preventDefault()
    syncPanel(true)
  })

  syncPanel()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
