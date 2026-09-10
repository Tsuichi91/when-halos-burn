import './styles/world-map.css'
import './styles/world-map-districts.css'

const root = document.querySelector('#world-app')

const locations = [
  {
    id:'MAP-01', title:'HALO HEADQUARTERS', short:'HALO HQ', affiliation:'HALO', role:'CIVIC AUTHORITY / CONTROL GRID', x:64, y:30, district:'CROWN DISTRICT',
    image:'./images/world/halo-headquarters.png',
    body:'The public face of HALO’s security architecture: visible, ordered and central to Vesper’s civic authority.',
    stats:[['DISTRICT','CROWN DISTRICT'],['ACCESS','CONTROLLED'],['SYSTEM','HALO'],['STATE','ACTIVE']],
    chapter:'03', chapterLabel:'HOLD THE LINE'
  },
  {
    id:'MAP-02', title:'HALO CORE', short:'CORE', affiliation:'HALO', role:'SEALED ARCHIVE / CENTRAL SYSTEM', x:70, y:43, district:'CROWN DISTRICT',
    image:'./images/archive/locations/halo-core.png',
    body:'The sealed institutional heart of HALO. The complete Blackout archive survives here behind controlled access.',
    stats:[['DISTRICT','CROWN DISTRICT'],['ACCESS','CORE / RESTRICTED'],['SYSTEM','HALO'],['STATE','SEALED → RELEASED']],
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'MAP-03', title:'BORDER DISTRICT', short:'BORDER', affiliation:'CIVIC', role:'FIRST CONTACT / CONTACT ZONE', x:40, y:54, district:'BORDER DISTRICT',
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'The district where Jiwon and Taeyun first meet in 2164 and the story’s clean Hero/Villain line immediately begins to fail.',
    stats:[['DISTRICT','BORDER DISTRICT'],['ACCESS','PUBLIC / VARIABLE'],['SYSTEM','MIXED'],['STATE','CONTESTED']],
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'MAP-04', title:'THE OBSERVATORY', short:'OBSERVATORY', affiliation:'NEUTRAL', role:'NEUTRAL GROUND / RECURRING LOCATION', x:79, y:18, district:'NORTH RIDGE',
    image:'./images/archive/locations/observatory.png',
    body:'A space outside either faction’s full control. Repeated voluntary meetings turn it from neutral ground into shared memory.',
    stats:[['DISTRICT','NORTH RIDGE'],['ACCESS','LIMITED PUBLIC'],['SYSTEM','LEGACY CIVIC'],['STATE','NEUTRAL']],
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'MAP-05', title:'ECLIPSE HUB', short:'ECLIPSE HUB', affiliation:'ECLIPSE', role:'SHADOW GRID / OLD TRANSIT', x:27, y:74, district:'OLD TRANSIT',
    image:'./images/world/eclipse-headquarters.png',
    body:'A covert operations hub embedded in Vesper’s older transit infrastructure and the blind spots HALO no longer treats as central.',
    stats:[['DISTRICT','OLD TRANSIT'],['ACCESS','COVERT'],['SYSTEM','ECLIPSE'],['STATE','HIDDEN']],
    chapter:'02', chapterLabel:'NO SAINT'
  }
]

const districts = [
  {
    id:'DST-01', title:'CROWN DISTRICT', affiliation:'HALO', role:'GOVERNANCE / HIGH-CLEARANCE CIVIC CORE', polygon:'560,150 790,165 790,345 560,360 520,250', labelX:66, labelY:39,
    image:'./images/world/halo-headquarters.png',
    body:'Vesper’s administrative center. Council offices, HALO Headquarters and the Core sit inside the city’s most continuously monitored district, where security and civic prestige are designed to look identical.',
    stats:[['FUNCTION','GOVERNANCE'],['HALO DENSITY','MAXIMUM'],['NETWORK COVERAGE','CONTINUOUS'],['STORY NODES','HALO HQ / CORE']],
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'DST-02', title:'MERIDIAN WARD', affiliation:'CIVIC', role:'TRANSIT / COMMERCE / ORDINARY VESPER', polygon:'260,60 580,65 550,245 300,250 220,170', labelX:39, labelY:24,
    image:'./images/landing/vesper-city.png',
    body:'The city’s busiest everyday layer: transfer stations, retail concourses, offices and vertical housing. HALO is everywhere here, but mostly as convenience — access gates, route prediction and seamless identity verification.',
    stats:[['FUNCTION','TRANSIT / COMMERCE'],['HALO DENSITY','HIGH'],['NETWORK COVERAGE','DENSE'],['SOCIAL CHARACTER','ORDINARY / MOBILE']]
  },
  {
    id:'DST-03', title:'BORDER DISTRICT', affiliation:'CONTESTED', role:'TRANSITION ZONE / MIXED INFRASTRUCTURE', polygon:'260,250 540,255 560,410 300,420 220,340', labelX:39, labelY:55,
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'A transition belt where newer monitored development meets older streets, service routes and freight infrastructure. Coverage is strong on main corridors and inconsistent in the spaces between them — exactly the kind of ambiguity HALO dislikes.',
    stats:[['FUNCTION','TRANSITION / FREIGHT'],['HALO DENSITY','VARIABLE'],['NETWORK COVERAGE','PATCHED'],['STORY EVENT','FIRST CONTACT']],
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'DST-04', title:'NORTH RIDGE', affiliation:'NEUTRAL', role:'RESEARCH / CIVIC OVERLOOK / LEGACY NETWORK', polygon:'590,20 970,20 970,170 790,180 620,140', labelX:79, labelY:12,
    image:'./images/archive/locations/observatory.png',
    body:'An elevated, lower-density civic and research district built before Vesper’s newest network standards. Its older systems are still monitored, but less seamlessly, leaving pockets of privacy without turning the area into a lawless blind spot.',
    stats:[['FUNCTION','RESEARCH / OVERLOOK'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','LEGACY / PARTIAL'],['STORY NODE','OBSERVATORY']],
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'DST-05', title:'OLD TRANSIT', affiliation:'ECLIPSE', role:'DECOMMISSIONED INFRASTRUCTURE / SHADOW GRID', polygon:'40,360 300,420 350,610 30,610', labelX:19, labelY:79,
    image:'./images/world/eclipse-headquarters.png',
    body:'Disused platforms, maintenance corridors, utility rooms and service tunnels left behind by successive transit rebuilds. The district is not abandoned; it is simply low-priority enough for coverage to become fragmented and exploitable.',
    stats:[['FUNCTION','LEGACY INFRASTRUCTURE'],['HALO DENSITY','LOW'],['NETWORK COVERAGE','FRAGMENTED'],['STORY NODE','ECLIPSE HUB']],
    chapter:'02', chapterLabel:'NO SAINT'
  },
  {
    id:'DST-06', title:'LOWER GRID', affiliation:'CIVIC', role:'RESIDENTIAL / UTILITIES / SERVICE CITY', polygon:'300,420 700,390 750,610 350,610', labelX:52, labelY:79,
    image:'./images/landing/vesper-city.png',
    body:'Dense residential blocks and utility infrastructure supporting the more polished city above. HALO coverage is reliable on primary streets and public systems, but upgrades have reached the deeper service layers unevenly.',
    stats:[['FUNCTION','RESIDENTIAL / UTILITIES'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','UNEVEN'],['SOCIAL CHARACTER','DENSE / PRACTICAL']]
  },
  {
    id:'DST-07', title:'GLASSLINE', affiliation:'HALO', role:'HIGH-INTEGRATION / CORPORATE RESIDENTIAL', polygon:'790,170 970,175 970,610 750,610 700,390 790,345', labelX:87, labelY:60,
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
    <polygon points="${district.polygon}"></polygon>
  </g>`).join('')

const districtLabels = () => districts.map((district) => `
  <span class="world-map-district-label" data-district-label="${district.id}" style="--x:${district.labelX}%;--y:${district.labelY}%"><strong>${district.title}</strong><small>${district.id}</small></span>`).join('')

const locationMarkers = () => locations.map((node) => `
  <button class="world-map-marker" type="button" data-map-node="${node.id}" data-affiliation="${node.affiliation}" style="--x:${node.x}%;--y:${node.y}%" aria-label="Show ${node.title}">
    <span class="world-map-marker__pulse"></span><i></i><strong>${node.short}</strong><small>${node.id}</small>
  </button>`).join('')

const mapMarkup = () => `
  <section class="world-map-section" id="city-map" aria-labelledby="world-map-title">
    <header class="world-map-section__head">
      <div><span>VESPER CITY / CARTOGRAPHIC LAYER</span><h2 id="world-map-title">INTERACTIVE CITY MAP</h2></div>
      <p>Vesper’s seven functional districts and its key story locations share one map. Select a location node or any open district area to inspect how the city and story overlap.</p>
    </header>

    <div class="world-map-shell">
      <div class="world-map-canvas" data-world-map-canvas>
        <div class="world-map-canvas__grid" aria-hidden="true"></div>
        <svg class="world-map-canvas__districts" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-label="Vesper City districts">
          ${districtMarkup()}
        </svg>
        <svg class="world-map-canvas__routes" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
          <path d="M70 470 C235 430 300 330 405 336 S595 410 710 272 S880 118 958 112" />
          <path d="M95 190 C250 205 318 270 410 338 S590 385 704 268 S842 216 940 250" />
          <path d="M235 585 C260 470 320 402 405 336 S530 235 645 188 S820 120 918 54" />
          <circle cx="650" cy="205" r="112" />
          <circle cx="650" cy="205" r="164" />
        </svg>
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
