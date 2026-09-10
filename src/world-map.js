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
    id:'DST-01', title:'CROWN DISTRICT', affiliation:'HALO', role:'GOVERNANCE / HIGH-CLEARANCE CIVIC CORE', shape:'M520 146 C580 132 650 138 710 150 C770 163 815 185 835 225 C853 264 840 310 806 342 C765 380 705 392 635 382 C575 373 532 348 510 310 C492 276 494 228 506 188 C510 170 514 156 520 146 Z', labelX:68, labelY:34,
    image:'./images/world/halo-headquarters.png',
    body:'Vesper’s administrative center. Council offices, HALO Headquarters and the Core sit inside the city’s most continuously monitored district, where security and civic prestige are designed to look identical.',
    stats:[['FUNCTION','GOVERNANCE'],['HALO DENSITY','MAXIMUM'],['NETWORK COVERAGE','CONTINUOUS'],['STORY NODES','HALO HQ / CORE']],
    chapter:'12', chapterLabel:'WHEN HALOS BURN'
  },
  {
    id:'DST-02', title:'MERIDIAN WARD', affiliation:'CIVIC', role:'TRANSIT / COMMERCE / ORDINARY VESPER', shape:'M112 30 C230 16 380 25 520 62 C535 110 532 155 512 197 C470 226 420 242 352 248 C270 255 195 247 140 220 C110 190 95 148 96 105 C98 72 103 48 112 30 Z', labelX:34, labelY:18,
    image:'./images/landing/vesper-city.png',
    body:'The city’s busiest everyday layer: transfer stations, retail concourses, offices and vertical housing. HALO is everywhere here, but mostly as convenience — access gates, route prediction and seamless identity verification.',
    stats:[['FUNCTION','TRANSIT / COMMERCE'],['HALO DENSITY','HIGH'],['NETWORK COVERAGE','DENSE'],['SOCIAL CHARACTER','ORDINARY / MOBILE']]
  },
  {
    id:'DST-03', title:'BORDER DISTRICT', affiliation:'CONTESTED', role:'TRANSITION ZONE / MIXED INFRASTRUCTURE', shape:'M140 240 C235 232 335 236 430 245 C470 248 495 251 510 258 C518 307 519 348 505 392 C490 416 464 427 420 432 C335 441 245 430 170 403 C145 382 128 350 125 318 C124 286 130 260 140 240 Z', labelX:34, labelY:54,
    image:'./images/tracks/01b-first-contact/hero.png',
    body:'A transition belt where newer monitored development meets older streets, service routes and freight infrastructure. Coverage is strong on main corridors and inconsistent in the spaces between them — exactly the kind of ambiguity HALO dislikes.',
    stats:[['FUNCTION','TRANSITION / FREIGHT'],['HALO DENSITY','VARIABLE'],['NETWORK COVERAGE','PATCHED'],['STORY EVENT','FIRST CONTACT']],
    chapter:'01B', chapterLabel:'FIRST CONTACT'
  },
  {
    id:'DST-04', title:'NORTH RIDGE', affiliation:'NEUTRAL', role:'RESEARCH / CIVIC OVERLOOK / LEGACY NETWORK', shape:'M560 0 L1000 0 L1000 150 C940 150 895 158 850 165 C792 174 735 165 682 148 C630 132 595 112 574 88 C568 60 563 30 560 0 Z', labelX:80, labelY:9,
    image:'./images/archive/locations/observatory.png',
    body:'An elevated, lower-density civic and research district built before Vesper’s newest network standards. Its older systems are still monitored, but less seamlessly, leaving pockets of privacy without turning the area into a lawless blind spot.',
    stats:[['FUNCTION','RESEARCH / OVERLOOK'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','LEGACY / PARTIAL'],['STORY NODE','OBSERVATORY']],
    chapter:'05', chapterLabel:'AFTER CURFEW'
  },
  {
    id:'DST-05', title:'OLD TRANSIT', affiliation:'ECLIPSE', role:'DECOMMISSIONED INFRASTRUCTURE / SHADOW GRID', shape:'M0 360 C50 347 100 347 140 365 C171 386 192 413 205 448 C221 490 236 548 250 620 L0 620 Z', labelX:16, labelY:82,
    image:'./images/world/eclipse-headquarters.png',
    body:'Disused platforms, maintenance corridors, utility rooms and service tunnels left behind by successive transit rebuilds. The district is not abandoned; it is simply low-priority enough for coverage to become fragmented and exploitable.',
    stats:[['FUNCTION','LEGACY INFRASTRUCTURE'],['HALO DENSITY','LOW'],['NETWORK COVERAGE','FRAGMENTED'],['STORY NODE','ECLIPSE HUB']],
    chapter:'02', chapterLabel:'NO SAINT'
  },
  {
    id:'DST-06', title:'LOWER GRID', affiliation:'CIVIC', role:'RESIDENTIAL / UTILITIES / SERVICE CITY', shape:'M168 403 C250 430 335 442 420 432 C485 424 550 407 610 395 C662 384 715 382 770 392 C748 470 742 548 760 620 L250 620 C237 552 222 495 205 448 C194 420 182 410 168 403 Z', labelX:53, labelY:80,
    image:'./images/landing/vesper-city.png',
    body:'Dense residential blocks and utility infrastructure supporting the more polished city above. HALO coverage is reliable on primary streets and public systems, but upgrades have reached the deeper service layers unevenly.',
    stats:[['FUNCTION','RESIDENTIAL / UTILITIES'],['HALO DENSITY','MODERATE'],['NETWORK COVERAGE','UNEVEN'],['SOCIAL CHARACTER','DENSE / PRACTICAL']]
  },
  {
    id:'DST-07', title:'GLASSLINE', affiliation:'HALO', role:'HIGH-INTEGRATION / CORPORATE RESIDENTIAL', shape:'M835 150 C890 145 945 146 1000 150 L1000 620 L760 620 C742 548 748 470 770 392 C782 354 806 342 825 315 C846 284 854 250 848 215 C845 188 840 166 835 150 Z', labelX:88, labelY:58,
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
  <svg class="world-map-citybase" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
    <g class="world-city-water">
      <path class="world-city-water__body" d="M468 -20 C482 72 461 142 476 205 C494 279 533 333 526 410 C518 495 487 555 503 640 L584 640 C562 553 594 495 596 410 C599 326 558 266 544 203 C531 140 548 72 533 -20 Z"/>
      <path class="world-city-water__edge" d="M468 -20 C482 72 461 142 476 205 C494 279 533 333 526 410 C518 495 487 555 503 640"/>
      <path class="world-city-water__edge" d="M533 -20 C548 72 531 140 544 203 C558 266 599 326 596 410 C594 495 562 553 584 640"/>
    </g>

    <g class="world-city-green world-city-green--ridge">
      <path d="M615 18 C700 10 805 20 905 50 C862 80 820 103 758 112 C700 119 648 105 602 78 Z"/>
      <path class="world-city-contour" d="M635 37 C715 28 785 37 866 59"/>
      <path class="world-city-contour" d="M651 58 C727 49 784 55 833 74"/>
    </g>
    <g class="world-city-green world-city-green--south">
      <path d="M603 515 C650 493 706 490 744 505 C733 546 731 582 738 614 L612 614 C603 580 600 548 603 515 Z"/>
    </g>

    <g class="world-city-blocks world-city-blocks--meridian">
      <path d="M128 55 L202 48 L214 96 L141 105 Z"/><path d="M224 44 L302 43 L308 91 L232 93 Z"/>
      <path d="M329 46 L409 52 L405 101 L327 96 Z"/><path d="M421 58 L493 73 L485 119 L417 106 Z"/>
      <path d="M119 121 L196 116 L205 164 L128 171 Z"/><path d="M222 111 L298 108 L305 161 L230 165 Z"/>
      <path d="M329 115 L395 117 L399 171 L330 169 Z"/><path d="M414 124 L482 136 L477 184 L414 176 Z"/>
      <path d="M145 187 L217 183 L229 222 L158 226 Z"/><path d="M246 184 L317 182 L324 229 L253 231 Z"/>
      <path d="M345 185 L406 187 L412 231 L351 234 Z"/><path d="M430 192 L486 197 L470 225 L426 229 Z"/>
    </g>

    <g class="world-city-blocks world-city-blocks--border">
      <path d="M155 260 L232 256 L240 304 L164 309 Z"/><path d="M258 259 L332 260 L337 306 L265 307 Z"/>
      <path d="M357 262 L430 266 L429 309 L358 307 Z"/><path d="M448 269 L496 276 L499 315 L447 311 Z"/>
      <path d="M147 329 L218 324 L229 368 L160 376 Z"/><path d="M244 326 L320 324 L326 375 L251 377 Z"/>
      <path d="M350 328 L420 329 L421 378 L352 380 Z"/><path d="M443 329 L500 326 L497 378 L444 382 Z"/>
      <path d="M183 390 L258 389 L270 418 L202 414 Z"/><path d="M291 389 L369 390 L372 425 L300 426 Z"/>
    </g>

    <g class="world-city-blocks world-city-blocks--crown">
      <path d="M548 176 L611 166 L619 207 L557 218 Z"/><path d="M732 166 L796 181 L788 220 L726 207 Z"/>
      <path d="M531 235 L590 230 L593 271 L531 276 Z"/><path d="M754 231 L820 239 L814 281 L751 273 Z"/>
      <path d="M540 301 L601 299 L606 345 L549 347 Z"/><path d="M728 304 L793 298 L799 338 L739 347 Z"/>
      <path d="M616 350 L661 355 L658 378 L617 373 Z"/><path d="M687 352 L729 347 L734 370 L692 378 Z"/>
    </g>

    <g class="world-city-blocks world-city-blocks--glassline">
      <path d="M867 178 L903 174 L910 257 L874 264 Z"/><path d="M925 170 L968 168 L972 249 L931 255 Z"/>
      <path d="M851 287 L893 281 L900 369 L858 376 Z"/><path d="M917 277 L962 273 L968 367 L923 372 Z"/>
      <path d="M842 400 L888 396 L895 493 L848 499 Z"/><path d="M913 393 L964 391 L970 487 L919 492 Z"/>
      <path d="M837 520 L884 516 L889 605 L840 609 Z"/><path d="M911 515 L966 513 L970 606 L915 608 Z"/>
    </g>

    <g class="world-city-blocks world-city-blocks--lower">
      <path d="M274 454 L331 452 L336 490 L278 493 Z"/><path d="M352 450 L409 447 L412 486 L356 488 Z"/>
      <path d="M432 444 L489 437 L493 479 L437 485 Z"/><path d="M528 426 L580 417 L585 462 L534 470 Z"/>
      <path d="M285 510 L345 508 L349 548 L288 550 Z"/><path d="M369 505 L426 501 L430 544 L373 547 Z"/>
      <path d="M451 498 L505 491 L510 536 L456 541 Z"/><path d="M548 482 L599 473 L605 521 L553 529 Z"/>
      <path d="M302 566 L361 563 L365 606 L306 608 Z"/><path d="M386 559 L444 555 L448 604 L390 607 Z"/>
      <path d="M472 548 L529 541 L534 599 L477 604 Z"/><path d="M568 536 L619 529 L623 594 L573 600 Z"/>
    </g>

    <g class="world-city-industrial">
      <path d="M32 401 L102 385 L119 438 L48 455 Z"/><path d="M119 389 L174 386 L189 435 L136 441 Z"/>
      <path d="M38 478 L112 463 L127 512 L55 530 Z"/><path d="M137 463 L193 465 L204 515 L150 513 Z"/>
      <path d="M54 548 L117 535 L128 591 L67 604 Z"/>
    </g>

    <g class="world-city-streets world-city-streets--secondary">
      <path d="M96 106 C205 96 335 97 512 120"/><path d="M118 178 C244 169 355 173 504 197"/>
      <path d="M128 246 C250 238 371 239 507 252"/><path d="M126 318 C239 313 369 315 509 320"/>
      <path d="M148 387 C275 381 382 384 500 391"/><path d="M245 432 C250 492 251 555 250 620"/>
      <path d="M332 432 C337 494 337 556 337 620"/><path d="M420 430 C423 491 424 556 425 620"/>
      <path d="M610 394 C611 466 610 541 612 620"/><path d="M690 385 C689 460 691 540 696 620"/>
      <path d="M829 161 C823 274 812 385 805 620"/><path d="M906 154 C902 280 899 420 898 620"/>
      <path d="M561 150 C590 192 610 235 611 296"/><path d="M748 151 C735 190 728 228 731 274"/>
      <path d="M610 74 C705 95 790 110 875 115"/><path d="M663 120 C747 135 827 141 936 136"/>
    </g>

    <g class="world-city-streets world-city-streets--primary">
      <path d="M36 282 C185 270 302 282 392 330 C477 376 565 381 650 350 C744 316 824 282 990 282"/>
      <path d="M186 620 C215 526 285 451 378 373 C443 319 475 251 458 179 C446 128 394 98 286 93"/>
      <path d="M381 373 C510 391 607 365 689 321 C759 283 835 266 990 276"/>
      <path d="M688 321 C748 274 792 226 823 167 C855 108 903 70 990 56"/>
      <path d="M514 214 C566 214 608 213 651 209 C699 205 748 205 817 215"/>
    </g>

    <g class="world-city-bridges">
      <path d="M456 180 L545 177"/><path d="M468 280 L565 278"/><path d="M500 374 L592 372"/><path d="M509 492 L587 493"/>
    </g>

    <g class="world-city-rail">
      <path d="M18 500 C82 474 136 462 205 471"/><path d="M20 510 C84 484 139 472 208 481"/>
      <path d="M31 531 C92 507 147 496 214 503"/><path d="M35 542 C97 519 151 507 217 514"/>
    </g>

    <g class="world-city-civic">
      <circle cx="683" cy="257" r="57"/><circle cx="683" cy="257" r="38"/>
      <path d="M683 200 L683 314"/><path d="M626 257 L740 257"/>
      <path class="world-city-civic__plaza" d="M647 221 L719 221 L719 293 L647 293 Z"/>
    </g>
  </svg>
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
        <svg class="world-map-canvas__districts" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-label="Vesper City districts">
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
