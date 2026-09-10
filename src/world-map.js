import './styles/world-map.css'
import './styles/world-map-districts.css'

const root = document.querySelector('#world-app')

const locations = [
  {
    id:'MAP-01', title:'HALO HEADQUARTERS', short:'HALO HQ', affiliation:'HALO', role:'CIVIC AUTHORITY / CONTROL GRID', x:52, y:39, district:'CROWN DISTRICT',
    image:'./images/world/halo-headquarters.png',
    body:'The public face of HALO’s security architecture: visible, ordered and central to Vesper’s civic authority.',
    stats:[['DISTRICT','CROWN DISTRICT'],['ACCESS','CONTROLLED'],['SYSTEM','HALO'],['STATE','ACTIVE']],
    chapter:'03', chapterLabel:'HOLD THE LINE'
  },
  {
    id:'MAP-02', title:'HALO CORE', short:'CORE', affiliation:'HALO', role:'SEALED ARCHIVE / CENTRAL SYSTEM', x:58, y:45, district:'CROWN DISTRICT',
    image:'./images/archive/locations/halo-core.png',
    body:'The sealed institutional heart of HALO. The complete Blackout archive survives here behind controlled access.',
    stats:[['DISTRICT','CROWN DISTRICT'],['ACCESS','CORE / RESTRICTED'],['SYSTEM','HALO'],['STATE','SEALED → RELEASED']],
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'MAP-03', title:'BORDER DISTRICT', short:'BORDER', affiliation:'CIVIC', role:'FIRST CONTACT / CONTACT ZONE', x:16, y:54, district:'BORDER DISTRICT',
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'The district where Jiwon and Taeyun first meet in 2164 and the story’s clean Hero/Villain line immediately begins to fail.',
    stats:[['DISTRICT','BORDER DISTRICT'],['ACCESS','PUBLIC / VARIABLE'],['SYSTEM','MIXED'],['STATE','CONTESTED']],
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'MAP-04', title:'THE OBSERVATORY', short:'OBSERVATORY', affiliation:'NEUTRAL', role:'NEUTRAL GROUND / RECURRING LOCATION', x:50, y:13, district:'NORTH RIDGE',
    image:'./images/archive/locations/observatory.png',
    body:'A space outside either faction’s full control. Repeated voluntary meetings turn it from neutral ground into shared memory.',
    stats:[['DISTRICT','NORTH RIDGE'],['ACCESS','LIMITED PUBLIC'],['SYSTEM','LEGACY CIVIC'],['STATE','NEUTRAL']],
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'MAP-05', title:'ECLIPSE HUB', short:'ECLIPSE HUB', affiliation:'ECLIPSE', role:'SHADOW GRID / OLD TRANSIT', x:22, y:73, district:'OLD TRANSIT',
    image:'./images/world/eclipse-headquarters.png',
    body:'A covert operations hub embedded in Vesper’s older transit infrastructure and the blind spots HALO no longer treats as central.',
    stats:[['DISTRICT','OLD TRANSIT'],['ACCESS','COVERT'],['SYSTEM','ECLIPSE'],['STATE','HIDDEN']],
    chapter:'02', chapterLabel:'NO SAINT'
  }
]

const districts = [
  {
    id:'DST-01', title:'CROWN DISTRICT', affiliation:'HALO', role:'GOVERNANCE / HIGH-CLEARANCE CIVIC CORE', shape:'M430 180 C470 155 525 145 585 155 C635 166 676 194 695 230 C710 260 706 301 689 331 C668 367 629 386 581 389 C526 391 479 374 449 343 C421 314 408 278 411 238 C414 215 420 195 430 180 Z', labelX:56, labelY:47,
    image:'./images/world/halo-headquarters.png',
    body:'Vesper’s administrative center. Council offices, HALO Headquarters and the Core sit inside the city’s most continuously monitored district, where security and civic prestige are designed to look identical.',
    stats:[['FUNCTION','GOVERNANCE'],['HALO DENSITY','MAXIMUM'],['NETWORK COVERAGE','CONTINUOUS'],['STORY NODES','HALO HQ / CORE']],
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'DST-02', title:'MERIDIAN WARD', affiliation:'CIVIC', role:'TRANSIT / COMMERCE / ORDINARY VESPER', shape:'M70 70 C140 42 235 40 332 55 C387 64 423 82 443 111 C449 150 443 193 422 226 C391 256 347 273 291 279 C224 284 159 276 112 253 C80 228 63 194 59 154 C58 120 61 92 70 70 Z', labelX:25, labelY:27,
    image:'./images/landing/vesper-city.png',
    body:'The city’s busiest everyday layer: transfer stations, retail concourses, offices and vertical housing. HALO is everywhere here, but mostly as convenience — access gates, route prediction and seamless identity verification.',
    stats:[['FUNCTION','TRANSIT / COMMERCE'],['HALO DENSITY','HIGH'],['NETWORK COVERAGE','DENSE'],['SOCIAL CHARACTER','ORDINARY / MOBILE']]
  },
  {
    id:'DST-03', title:'BORDER DISTRICT', affiliation:'CONTESTED', role:'TRANSITION ZONE / MIXED INFRASTRUCTURE', shape:'M44 223 C92 215 145 218 190 234 C225 247 250 269 265 302 C266 337 252 367 226 390 C195 411 153 419 108 411 C76 403 53 386 39 359 C31 329 32 296 35 267 C37 248 39 235 44 223 Z', labelX:15, labelY:53,
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'A transition belt where newer monitored development meets older streets, service routes and freight infrastructure. Coverage is strong on main corridors and inconsistent in the spaces between them — exactly the kind of ambiguity HALO dislikes.',
    stats:[['FUNCTION','TRANSITION / FREIGHT'],['HALO DENSITY','VARIABLE'],['NETWORK COVERAGE','PATCHED'],['STORY EVENT','FIRST CONTACT']],
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'DST-04', title:'NORTH RIDGE', affiliation:'NEUTRAL', role:'RESEARCH / CIVIC OVERLOOK / LEGACY NETWORK', shape:'M335 20 C408 8 493 10 572 24 C625 34 667 49 696 70 C681 101 653 124 617 142 C575 158 525 164 470 158 C417 151 372 137 340 114 C325 86 324 54 335 20 Z', labelX:50, labelY:13,
    image:'./images/archive/locations/observatory.png',
    body:'An elevated, lower-density civic and research district built before Vesper’s newest network standards. Its older systems are still monitored, but less seamlessly, leaving pockets of privacy without turning the area into a lawless blind spot.',
    stats:[['FUNCTION','RESEARCH / OVERLOOK'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','LEGACY / PARTIAL'],['STORY NODE','OBSERVATORY']],
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'DST-05', title:'OLD TRANSIT', affiliation:'ECLIPSE', role:'DECOMMISSIONED INFRASTRUCTURE / SHADOW GRID', shape:'M18 337 C67 319 117 320 158 337 C195 353 226 377 249 410 C260 446 264 487 260 540 L45 540 C27 501 17 459 12 418 C9 385 10 357 18 337 Z', labelX:17, labelY:76,
    image:'./images/world/eclipse-headquarters.png',
    body:'Disused platforms, maintenance corridors, utility rooms and service tunnels left behind by successive transit rebuilds. The district is not abandoned; it is simply low-priority enough for coverage to become fragmented and exploitable.',
    stats:[['FUNCTION','LEGACY INFRASTRUCTURE'],['HALO DENSITY','LOW'],['NETWORK COVERAGE','FRAGMENTED'],['STORY NODE','ECLIPSE HUB']],
    chapter:'02', chapterLabel:'NO SAINT'
  },
  {
    id:'DST-06', title:'LOWER GRID', affiliation:'CIVIC', role:'RESIDENTIAL / UTILITIES / SERVICE CITY', shape:'M242 349 C299 344 360 347 417 359 C469 370 521 388 566 413 C589 448 597 489 596 541 L255 541 C259 503 257 467 249 433 C242 402 237 374 242 349 Z', labelX:44, labelY:77,
    image:'./images/landing/vesper-city.png',
    body:'Dense residential blocks and utility infrastructure supporting the more polished city above. HALO coverage is reliable on primary streets and public systems, but upgrades have reached the deeper service layers unevenly.',
    stats:[['FUNCTION','RESIDENTIAL / UTILITIES'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','UNEVEN'],['SOCIAL CHARACTER','DENSE / PRACTICAL']]
  },
  {
    id:'DST-07', title:'GLASSLINE', affiliation:'HALO', role:'HIGH-INTEGRATION / CORPORATE RESIDENTIAL', shape:'M673 92 C727 73 789 70 847 82 C896 93 928 118 944 153 C951 191 947 231 935 272 C920 318 906 357 902 403 C898 446 903 489 915 541 L658 541 C646 499 641 456 648 415 C655 369 672 333 688 299 C705 264 711 225 704 188 C698 150 686 119 673 92 Z', labelX:79, labelY:43,
    image:'./images/landing/vesper-city.png',
    body:'A high-income vertical district where HALO integration is nearly frictionless: buildings recognize residents, routes adapt automatically and civic services arrive before they are requested. Control feels least visible where the system works best.',
    stats:[['FUNCTION','CORPORATE / RESIDENTIAL'],['HALO DENSITY','VERY HIGH'],['NETWORK COVERAGE','NEAR-TOTAL'],['PUBLIC IDEAL','FRICTIONLESS LIFE']]
  }
]

const filters = ['ALL','HALO','ECLIPSE','NEUTRAL','CIVIC']
let activeFilter = 'ALL'
let selectedType = 'location'
let selectedId = 'MAP-03'

const selectedItem = () => {
  const source = selectedType === 'district' ? districts : locations
  return source.find((item) => item.id === selectedId) || source[0]
}

const districtMarkup = () => districts.map((district) => `
  <g class="world-map-district" data-district-id="${district.id}" data-affiliation="${district.affiliation}" role="button" tabindex="0" aria-label="Show ${district.title}">
    <path d="${district.shape}"></path>
  </g>`).join('')

const districtLabels = () => districts.map((district) => `
  <span class="world-map-district-label" data-district-label="${district.id}" style="--x:${district.labelX}%;--y:${district.labelY}%"><strong>${district.title}</strong><small>${district.id}</small></span>`).join('')

const locationMarkers = () => locations.map((node) => `
  <button class="world-map-marker" type="button" data-map-node="${node.id}" data-affiliation="${node.affiliation}" style="--x:${node.x}%;--y:${node.y}%" aria-label="Show ${node.title}">
    <span class="world-map-marker__pulse"></span><i></i><strong>${node.short}</strong><small>${node.id}</small>
  </button>`).join('')

const cityMapBaseMarkup = () => `
  <img class="world-map-basemap" src="./images/world/vesper-city-basemap.png" alt="" aria-hidden="true" draggable="false" />
`

const mapMarkup = () => `
  <section class="world-map-section" id="city-map" aria-labelledby="world-map-title">
    <header class="world-map-section__head">
      <div><span>VESPER CITY / CARTOGRAPHIC LAYER</span><h2 id="world-map-title">INTERACTIVE CITY MAP</h2></div>
      <p>Vesper’s seven functional districts and its key story locations share one map. Select a location node or any open district area to inspect how the city and story overlap.</p>
    </header>

    <div class="world-map-shell">
      <div class="world-map-canvas" data-world-map-canvas>
        <div class="world-map-canvas__grid" aria-hidden="true"></div>
        <svg class="world-map-canvas__districts" viewBox="0 0 1000 566" preserveAspectRatio="none" aria-label="Vesper City districts">
          ${districtMarkup()}
        </svg>
        ${cityMapBaseMarkup()}
        ${districtLabels()}
        ${locationMarkers()}
        <div class="world-map-canvas__legend">
          <span><i class="world-map-key world-map-key--district"></i>DISTRICT <i class="world-map-key world-map-key--node"></i>LOCATION NODE</span>
        </div>
      </div>

      <aside class="world-map-panel" aria-live="polite">
        <div class="world-map-panel__mode"><span>MAP STATE</span><strong>COMBINED CITY LAYER</strong></div>
        <div class="world-map-panel__filters" aria-label="Location filters">${filters.map((filter) => `<button type="button" data-map-filter="${filter}" class="${filter === activeFilter ? 'is-active' : ''}">${filter}</button>`).join('')}</div>
        <div class="world-map-panel__art"><img src="" alt="" data-map-image /><div aria-hidden="true"></div></div>
        <div class="world-map-panel__meta"><span data-map-id></span><span data-map-affiliation></span></div>
        <small data-map-role></small>
        <h3 data-map-title></h3>
        <p data-map-body></p>
        <dl class="world-map-panel__stats" data-map-stats></dl>
        <div class="world-map-panel__actions"><a data-map-chapter href="#">OPEN STORY CHAPTER <i>↗</i></a><a href="./archive.html">OPEN ARCHIVE <i>↗</i></a></div>
        <div class="world-map-panel__directory" aria-label="Vesper map directory">
          <div><span>LOCATION NODES</span>${locations.map((item) => `<button type="button" data-map-list="${item.id}" data-map-list-type="location"><b>${item.id}</b><strong>${item.title}</strong></button>`).join('')}</div>
          <div><span>CITY DISTRICTS</span>${districts.map((item) => `<button type="button" data-map-list="${item.id}" data-map-list-type="district"><b>${item.id}</b><strong>${item.title}</strong></button>`).join('')}</div>
        </div>
      </aside>
    </div>
  </section>`

const syncContext = () => {
  const item = selectedItem()
  const districtTitle = selectedType === 'location' ? item.district : item.title

  root.querySelectorAll('[data-district-id]').forEach((district) => {
    const data = districts.find((entry) => entry.id === district.dataset.districtId)
    district.classList.toggle('is-selected', selectedType === 'district' && district.dataset.districtId === item.id)
    district.classList.toggle('is-context', Boolean(data && data.title === districtTitle))
  })
  root.querySelectorAll('[data-district-label]').forEach((label) => {
    const data = districts.find((entry) => entry.id === label.dataset.districtLabel)
    label.classList.toggle('is-selected', selectedType === 'district' && label.dataset.districtLabel === item.id)
    label.classList.toggle('is-context', Boolean(data && data.title === districtTitle))
  })
  root.querySelectorAll('[data-map-node]').forEach((node) => {
    const data = locations.find((entry) => entry.id === node.dataset.mapNode)
    node.classList.toggle('is-selected', selectedType === 'location' && node.dataset.mapNode === item.id)
    node.classList.toggle('is-context', selectedType === 'district' && data?.district === item.title)
  })
}

const syncPanel = (focusMap = false) => {
  const item = selectedItem()
  if (!item) return
  const set = (selector,value) => { const target = root.querySelector(selector); if (target) target.textContent = value }
  set('[data-map-id]', `${selectedType === 'district' ? 'DISTRICT' : 'LOCATION'} / ${item.id}`)
  set('[data-map-affiliation]', item.affiliation)
  set('[data-map-role]', item.role)
  set('[data-map-title]', item.title)
  set('[data-map-body]', item.body)

  const image = root.querySelector('[data-map-image]')
  if (image) { image.src = item.image; image.alt = item.title }

  const stats = root.querySelector('[data-map-stats]')
  if (stats) stats.innerHTML = (item.stats || []).map(([label,value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')

  const chapter = root.querySelector('[data-map-chapter]')
  if (chapter) {
    chapter.hidden = !item.chapter
    if (item.chapter) {
      chapter.href = `./chapter.html?chapter=${item.chapter}`
      chapter.firstChild.textContent = `${item.chapterLabel} `
    }
  }

  root.querySelectorAll('[data-map-list]').forEach((entry) => {
    entry.classList.toggle('is-selected', entry.dataset.mapList === item.id && entry.dataset.mapListType === selectedType)
  })

  syncContext()

  if (focusMap) {
    const target = selectedType === 'location'
      ? root.querySelector(`[data-map-node="${item.id}"]`)
      : root.querySelector(`[data-district-id="${item.id}"]`)
    target?.focus({ preventScroll:true })
  }
}

const applyFilter = (filter) => {
  activeFilter = filter
  root.querySelectorAll('[data-map-filter]').forEach((button) => button.classList.toggle('is-active', button.dataset.mapFilter === filter))
  root.querySelectorAll('[data-map-node]').forEach((node) => {
    const visible = filter === 'ALL' || node.dataset.affiliation === filter
    node.classList.toggle('is-filtered-out', !visible)
  })
  root.querySelectorAll('[data-map-list-type="location"]').forEach((entry) => {
    const item = locations.find((location) => location.id === entry.dataset.mapList)
    entry.hidden = Boolean(item && filter !== 'ALL' && item.affiliation !== filter)
  })

  if (selectedType === 'location') {
    const current = selectedItem()
    if (filter !== 'ALL' && current.affiliation !== filter) {
      const first = locations.find((location) => location.affiliation === filter)
      if (first) {
        selectedId = first.id
        syncPanel()
      }
    }
  }
}

const selectLocation = (id, focus = false) => {
  selectedType = 'location'
  selectedId = id
  syncPanel(focus)
}

const selectDistrict = (id, focus = false) => {
  selectedType = 'district'
  selectedId = id
  syncPanel(focus)
}

const handleDistrictKey = (event, district) => {
  if (!['Enter',' '].includes(event.key)) return
  event.preventDefault()
  selectDistrict(district.dataset.districtId)
}

const initialize = () => {
  if (!root) return
  const vesper = root.querySelector('#vesper-city')
  if (!vesper || root.querySelector('#city-map')) return
  vesper.insertAdjacentHTML('afterend', mapMarkup())

  root.addEventListener('click', (event) => {
    const marker = event.target.closest('[data-map-node]')
    if (marker) {
      event.stopPropagation()
      selectLocation(marker.dataset.mapNode)
      return
    }

    const district = event.target.closest('[data-district-id]')
    if (district) {
      selectDistrict(district.dataset.districtId)
      return
    }

    const listItem = event.target.closest('[data-map-list]')
    if (listItem) {
      if (listItem.dataset.mapListType === 'district') selectDistrict(listItem.dataset.mapList, true)
      else selectLocation(listItem.dataset.mapList, true)
      return
    }

    const filter = event.target.closest('[data-map-filter]')
    if (filter) applyFilter(filter.dataset.mapFilter)
  })

  root.querySelectorAll('[data-district-id]').forEach((district) => {
    district.addEventListener('keydown', (event) => handleDistrictKey(event, district))
  })

  root.querySelector('[data-world-map-canvas]')?.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return
    if (!event.target.closest('[data-map-node]')) return
    const visible = locations.filter((item) => activeFilter === 'ALL' || item.affiliation === activeFilter)
    if (!visible.length) return
    const index = Math.max(0, visible.findIndex((item) => item.id === selectedId))
    const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1
    const next = visible[(index + delta + visible.length) % visible.length]
    event.preventDefault()
    selectLocation(next.id, true)
  })

  syncPanel()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
