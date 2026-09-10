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
    id:'MAP-05', title:'ECLIPSE HUB', short:'ECLIPSE HUB', affiliation:'ECLIPSE', role:'SHADOW GRID / OLD TRANSIT', x:30.5, y:66.5, district:'OLD TRANSIT',
    image:'./images/world/eclipse-headquarters.png',
    body:'A covert operations hub embedded in Vesper’s older transit infrastructure and the blind spots HALO no longer treats as central.',
    stats:[['DISTRICT','OLD TRANSIT'],['ACCESS','COVERT'],['SYSTEM','ECLIPSE'],['STATE','HIDDEN']],
    chapter:'02', chapterLabel:'NO SAINT'
  }
]

const districts = [
  {
    id:'DST-01', title:'CROWN DISTRICT', affiliation:'HALO', role:'GOVERNANCE / HIGH-CLEARANCE CIVIC CORE',
    shape:'M 570 148 L 570 152 L 579 182 L 590 229 L 594 256 L 595 278 L 594 279 L 594 292 L 591 305 L 580 329 L 571 342 L 566 352 L 567 363 L 574 370 L 588 379 L 614 391 L 636 399 L 699 442 L 745 476 L 774 493 L 805 504 L 846 511 L 872 512 L 888 509 L 900 505 L 925 492 L 1001 441 L 1051 412 L 1089 394 L 1088 346 L 1086 332 L 1078 306 L 1068 290 L 1055 277 L 1040 267 L 1024 259 L 987 246 L 938 235 L 908 231 L 874 230 L 842 225 L 827 224 L 820 222 L 768 215 L 734 208 L 704 200 L 678 190 L 660 181 L 625 158 L 608 149 L 596 146 L 582 146 Z',
    labelX:49.5, labelY:43.5,
    image:'./images/world/halo-headquarters.png',
    body:'Vesper’s administrative center. Council offices, HALO Headquarters and the Core sit inside the city’s most continuously monitored district, where security and civic prestige are designed to look identical.',
    stats:[['FUNCTION','GOVERNANCE'],['HALO DENSITY','MAXIMUM'],['NETWORK COVERAGE','CONTINUOUS'],['STORY NODES','HALO HQ / CORE']],
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'DST-02', title:'MERIDIAN WARD', affiliation:'CIVIC', role:'TRANSIT / COMMERCE / ORDINARY VESPER',
    shape:'M 586 255 L 580 219 L 570 178 L 556 129 L 547 103 L 547 98 L 544 98 L 516 108 L 421 136 L 238 185 L 171 207 L 134 224 L 112 239 L 102 249 L 92 263 L 86 274 L 86 279 L 137 295 L 202 320 L 283 356 L 455 438 L 497 455 L 513 460 L 525 462 L 525 458 L 532 437 L 545 406 L 553 381 L 558 355 L 557 348 L 573 325 L 582 305 L 586 287 Z',
    labelX:28.11, labelY:27.63,
    image:'./images/landing/vesper-city.png',
    body:'The city’s busiest everyday layer: transfer stations, retail concourses, offices and vertical housing. HALO is everywhere here, but mostly as convenience — access gates, route prediction and seamless identity verification.',
    stats:[['FUNCTION','TRANSIT / COMMERCE'],['HALO DENSITY','HIGH'],['NETWORK COVERAGE','DENSE'],['SOCIAL CHARACTER','ORDINARY / MOBILE']]
  },
  {
    id:'DST-03', title:'BORDER DISTRICT', affiliation:'CONTESTED', role:'TRANSITION ZONE / MIXED INFRASTRUCTURE',
    shape:'M 82 285 L 82 299 L 83 300 L 82 347 L 85 371 L 61 487 L 62 501 L 75 527 L 162 562 L 244 597 L 249 597 L 256 592 L 279 581 L 295 582 L 304 572 L 308 572 L 323 586 L 332 584 L 333 583 L 333 566 L 337 528 L 346 474 L 355 443 L 372 408 L 290 368 L 211 333 L 127 299 L 93 287 Z',
    labelX:13, labelY:47,
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'A transition belt where newer monitored development meets older streets, service routes and freight infrastructure. Coverage is strong on main corridors and inconsistent in the spaces between them — exactly the kind of ambiguity HALO dislikes.',
    stats:[['FUNCTION','TRANSITION / FREIGHT'],['HALO DENSITY','VARIABLE'],['NETWORK COVERAGE','PATCHED'],['STORY EVENT','FIRST CONTACT']],
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'DST-04', title:'NORTH RIDGE', affiliation:'NEUTRAL', role:'RESEARCH / CIVIC OVERLOOK / LEGACY NETWORK',
    shape:'M 555 97 L 556 105 L 567 140 L 573 140 L 579 138 L 597 138 L 609 141 L 625 149 L 645 163 L 670 178 L 701 192 L 737 202 L 775 209 L 835 217 L 843 217 L 850 219 L 937 227 L 982 235 L 1032 254 L 1046 261 L 1062 273 L 1064 273 L 1067 262 L 1083 221 L 1101 186 L 1101 180 L 1097 163 L 1097 141 L 1100 131 L 1108 115 L 1108 106 L 1099 90 L 1071 86 L 998 72 L 993 70 L 988 70 L 885 47 L 879 47 L 839 39 L 808 37 L 807 36 L 761 38 L 698 55 L 678 65 L 670 77 L 662 85 L 649 90 L 608 95 Z',
    labelX:47.25, labelY:11.16,
    image:'./images/archive/locations/observatory.png',
    body:'An elevated, lower-density civic and research district built before Vesper’s newest network standards. Its older systems are still monitored, but less seamlessly, leaving pockets of privacy without turning the area into a lawless blind spot.',
    stats:[['FUNCTION','RESEARCH / OVERLOOK'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','LEGACY / PARTIAL'],['STORY NODE','OBSERVATORY']],
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'DST-05', title:'OLD TRANSIT', affiliation:'ECLIPSE', role:'DECOMMISSIONED INFRASTRUCTURE / SHADOW GRID',
    shape:'M 380 413 L 362 451 L 351 487 L 343 540 L 341 588 L 330 594 L 323 595 L 316 591 L 308 583 L 305 583 L 301 588 L 295 591 L 283 588 L 259 601 L 259 603 L 272 609 L 288 619 L 371 682 L 404 705 L 430 721 L 466 741 L 506 761 L 519 770 L 529 775 L 546 779 L 571 782 L 589 721 L 590 706 L 587 689 L 582 671 L 573 663 L 545 630 L 527 603 L 508 568 L 500 536 L 500 507 L 507 466 L 450 444 L 383 413 Z',
    labelX:25.72, labelY:61.11,
    image:'./images/world/eclipse-headquarters.png',
    body:'Disused platforms, maintenance corridors, utility rooms and service tunnels left behind by successive transit rebuilds. The district is not abandoned; it is simply low-priority enough for coverage to become fragmented and exploitable.',
    stats:[['FUNCTION','LEGACY INFRASTRUCTURE'],['HALO DENSITY','LOW'],['NETWORK COVERAGE','FRAGMENTED'],['STORY NODE','ECLIPSE HUB']],
    chapter:'02', chapterLabel:'NO SAINT'
  },
  {
    id:'DST-06', title:'LOWER GRID', affiliation:'CIVIC', role:'RESIDENTIAL / UTILITIES / SERVICE CITY',
    shape:'M 514 469 L 507 513 L 507 538 L 513 559 L 532 594 L 547 618 L 567 644 L 591 670 L 597 706 L 597 721 L 592 743 L 579 782 L 627 790 L 641 795 L 658 806 L 670 809 L 700 809 L 701 808 L 724 807 L 787 799 L 925 797 L 926 796 L 955 796 L 956 795 L 1002 794 L 1003 793 L 1024 793 L 1025 792 L 1090 790 L 1091 789 L 1118 789 L 1119 788 L 1220 786 L 1221 785 L 1267 785 L 1273 783 L 1280 756 L 1303 693 L 1305 683 L 1261 667 L 1245 663 L 1223 662 L 1209 658 L 1130 624 L 1113 593 L 1101 575 L 1036 498 L 1007 507 L 984 518 L 970 527 L 935 554 L 915 566 L 893 572 L 871 572 L 870 571 L 856 572 L 855 571 L 814 569 L 784 565 L 759 559 L 736 550 L 720 541 L 699 526 L 655 489 L 623 467 L 547 429 L 543 430 L 535 453 L 531 471 L 527 472 L 523 469 L 518 468 Z',
    labelX:46.95, labelY:77.05,
    image:'./images/landing/vesper-city.png',
    body:'Dense residential blocks and utility infrastructure supporting the more polished city above. HALO coverage is reliable on primary streets and public systems, but upgrades have reached the deeper service layers unevenly.',
    stats:[['FUNCTION','RESIDENTIAL / UTILITIES'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','UNEVEN'],['SOCIAL CHARACTER','DENSE / PRACTICAL']]
  },
  {
    id:'DST-07', title:'GLASSLINE', affiliation:'HALO', role:'HIGH-INTEGRATION / CORPORATE RESIDENTIAL',
    shape:'M 1111 92 L 1111 95 L 1116 106 L 1116 118 L 1106 141 L 1106 167 L 1110 194 L 1106 195 L 1092 222 L 1079 256 L 1070 275 L 1070 278 L 1085 300 L 1092 319 L 1094 332 L 1095 362 L 1099 402 L 1107 448 L 1088 453 L 1076 459 L 1058 472 L 1041 489 L 1041 492 L 1109 569 L 1123 591 L 1136 617 L 1166 632 L 1197 645 L 1226 653 L 1251 655 L 1317 678 L 1317 682 L 1311 694 L 1288 758 L 1282 783 L 1517 780 L 1528 778 L 1591 728 L 1606 713 L 1620 692 L 1615 632 L 1613 622 L 1613 612 L 1602 511 L 1593 397 L 1588 392 L 1478 246 L 1447 211 L 1405 170 L 1314 125 L 1288 114 L 1261 105 L 1232 100 L 1199 100 L 1198 101 L 1169 100 L 1137 96 L 1118 92 Z',
    labelX:75.66, labelY:34.01,
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
  <span class="world-map-district-label" data-district-label="${district.id}" style="left:${district.labelX}%;top:${district.labelY}%"><strong>${district.title}</strong></span>`).join('')

const locationMarkers = () => locations.map((node) => `
  <button class="world-map-marker" type="button" data-map-node="${node.id}" data-affiliation="${node.affiliation}" style="--x:${node.x}%;--y:${node.y}%" aria-label="Show ${node.title}">
    <span class="world-map-marker__pulse"></span><i></i><strong>${node.short}</strong>
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
        <svg class="world-map-canvas__districts" viewBox="0 0 1672 941" preserveAspectRatio="none" aria-label="Vesper City districts">
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
