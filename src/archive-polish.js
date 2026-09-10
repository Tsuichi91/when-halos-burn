import './styles/archive-polish.css'
import { getChapterHref } from './chapter-data.js'

const root = document.querySelector('#archive-app')
let queued = false
let locationPreviousFocus = null

const normalizeTrust = (value = '') => {
  const state = value.toUpperCase()
  if (state.includes('CONTRADICTED')) return 'contradicted'
  if (state.includes('PARTIALLY FALSE') || state.includes('ALTERED')) return 'altered'
  if (state.includes('PARTIAL')) return 'partial'
  if (state.includes('RECOVERED')) return 'recovered'
  if (state.includes('VERIFIED') || state.includes('POST-RELEASE')) return 'verified'
  return 'neutral'
}

const recordExtracts = {
  'REC-001': [
    ['GRID RESPONSE', 'COUNCIL-CONTROLLED'],
    ['BLACKOUT SCOPE', 'BROAD / DELIBERATE'],
    ['SEOJUN TERMINAL EVENT', 'INTERNAL FORCE / ███████']
  ],
  'REC-002': [
    ['PUBLIC DESIGNATION', 'HALO MARTYR'],
    ['WITNESS STATUS', 'REMOVED FROM PUBLIC FILE'],
    ['CAUSE LINK', '████████ / COUNCIL INTERNAL']
  ],
  'REC-003': [
    ['THREAT DESIGNATION', 'THE ARCHITECT'],
    ['ATTRIBUTED EVENT', 'BLACKOUT / DISPUTED'],
    ['CONFIRMED PROFILE', 'STRATEGIC / DECEPTIVE / HIGH RISK']
  ],
  'REC-004': [
    ['DESIGNATION', 'AEGIS'],
    ['SERVICE STATE', 'ACTIVE / 2164'],
    ['CONTEXT LAYER', 'BLACKOUT NARRATIVE / COMPROMISED']
  ],
  'REC-005': [
    ['SUBJECT', 'YOON MIRAE'],
    ['DETENTION TRACE', 'RECOVERED'],
    ['FINAL DISPOSITION', '████████ / CONCEALED']
  ],
  'REC-006': [
    ['CORE EVENT', 'ACCESS SEQUENCE / SEALED'],
    ['2158 TRACE', 'ISOLATION RESPONSE / RECOVERED'],
    ['2164 TRACE', 'ARCHIVE RELEASE / VERIFIED']
  ],
  'REC-007': [
    ['SUBJECT', 'HAN JIWON'],
    ['INITIAL FUNCTION', 'ACCESS VECTOR'],
    ['PLAN STATE', 'PROFILE → CONTACT → BIOMETRIC ACCESS']
  ],
  'REC-008': [
    ['SOURCE', 'HAN SEOJUN'],
    ['INTEGRITY', 'PARTIAL'],
    ['CORROBORATION', 'HALO SURVEILLANCE / CLASSIFICATION']
  ],
  'REC-009': [
    ['RELEASE POINT', 'HALO CORE'],
    ['ACCESS STATE', 'VERIFIED'],
    ['DISTRIBUTION', 'PUBLIC / 2164']
  ],
  'REC-010': [
    ['CIVIC STATE', 'POST-RELEASE'],
    ['OFFICIAL NARRATIVE', 'NO LONGER UNCONTESTED'],
    ['RESOLUTION', '████████ / PENDING']
  ]
}

const locations = {
  'VESPER CITY': {
    id:'LOC-00', title:'VESPER CITY', subtitle:'PRIMARY SETTING / 2164', image:'./images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png',
    fields:[['CLASSIFICATION','SURVEILLANCE METROPOLIS'],['AFFILIATION','CIVIC / CONTESTED'],['TIME','2164'],['STORY ROLE','THE SYSTEM AROUND THEM']],
    bio:'Vesper City is built around the promise that enough classification, observation and certainty can keep people safe. Its polished surfaces make HALO’s logic feel ordinary long before the story asks whether that logic is true.',
    significance:'The city is more than backdrop: its lines, glass, controlled light and constant visibility externalize the categories Jiwon and Taeyun must eventually outgrow. AFTERLIGHT does not replace Vesper with a better city; it leaves Vesper facing a truth it can no longer file away.',
    chapters:['01A','13']
  },
  'HALO HEADQUARTERS': {
    id:'LOC-01', title:'HALO HEADQUARTERS', subtitle:'CONTROL GRID / CIVIC AUTHORITY', image:'./images/world/halo-headquarters.png',
    fields:[['CLASSIFICATION','CIVIC SECURITY COMPLEX'],['AFFILIATION','HALO'],['ACCESS','CONTROLLED'],['STORY ROLE','ORDER / CERTAINTY']],
    bio:'HALO Headquarters turns institutional confidence into architecture: pale stone, silver, glass, symmetry and systems designed to appear legible. It is beautiful because HALO does not understand itself as a villainous institution.',
    significance:'For Jiwon, this is the physical language of duty. Review chambers and security corridors become increasingly unstable spaces as his own verification starts producing answers the institution did not intend him to find.',
    chapters:['01C','03','11']
  },
  'ECLIPSE HUB': {
    id:'LOC-02', title:'ECLIPSE HUB', subtitle:'SHADOW GRID / OLD TRANSIT', image:'./images/world/eclipse-headquarters.png',
    fields:[['CLASSIFICATION','REPURPOSED TRANSIT NETWORK'],['AFFILIATION','ECLIPSE'],['ACCESS','COVERT'],['STORY ROLE','RESISTANCE / OPERATIONS']],
    bio:'The Eclipse Hub occupies infrastructure Vesper no longer considers central: concrete, old transit systems and advanced technology built into what the city left behind. Its asymmetry is a practical condition, not an aesthetic rebellion for its own sake.',
    significance:'This is where Taeyun is most visibly The Architect — planning, controlling information and treating risk as something that can be calculated. It also becomes the place where separation forces him to send evidence without controlling what Jiwon does with it.',
    chapters:['02','10']
  },
  'THE OBSERVATORY': {
    id:'LOC-03', title:'THE OBSERVATORY', subtitle:'NEUTRAL GROUND / RECURRING LOCATION', image:'./images/archive/locations/observatory.png',
    fields:[['CLASSIFICATION','OBSERVATION PLATFORM'],['AFFILIATION','NEUTRAL'],['STATE','RECURRING'],['STORY ROLE','PROXIMITY / INTIMACY']],
    bio:'The Observatory begins as neutral ground: a place neither HALO nor Eclipse fully owns. Repeated voluntary meetings gradually change its meaning until the room carries coffee, treatment, familiar silence and the expectation that the other person might arrive.',
    significance:'Because the space becomes ordinary before it becomes safe, it holds several of the relationship’s most important transitions: temptation, vulnerability, the first kiss, private routine and finally betrayal. Its emptiness after FAULT LINE carries memory without needing destruction.',
    chapters:['05','06','07','08','09']
  },
  'HALO CORE': {
    id:'LOC-04', title:'HALO CORE', subtitle:'SEALED ARCHIVE / CENTRAL SYSTEM', image:'./images/archive/locations/halo-core.png',
    fields:[['CLASSIFICATION','CENTRAL ARCHIVE'],['AFFILIATION','HALO'],['ACCESS','CORE / RESTRICTED'],['STORY ROLE','TRUTH / RELEASE']],
    bio:'The HALO Core is the institutional endpoint of HALO’s design philosophy: order, classification and certainty made architectural. The complete Blackout archive is preserved here precisely because evidence was never absent — access to it was controlled.',
    significance:'The finale turns the Core from a symbol of institutional certainty into the place where certainty loses authority. Jiwon reaches the record on his own terms; the archive is released; truth becomes public without pretending that public truth instantly repairs the city.',
    chapters:['12']
  }
}

const timelineRecordLinks = {
  'MIRAE DISAPPEARS':'REC-005',
  'THE CORE INFILTRATION':'REC-006',
  'HAN SEOJUN':'REC-008',
  'THE OFFICIAL STORY':'REC-001',
  'JIWON ENTERS THE FILE':'REC-007',
  'FAULT LINE':'REC-007',
  'CHECK IT YOURSELF':'REC-008',
  'THE HALO CORE':'REC-009',
  'AFTERLIGHT':'REC-010'
}

const currentCategory = () => root?.querySelector('[data-archive-category].is-active')?.dataset.archiveCategory || ''

const enhanceRecords = () => {
  if (currentCategory() !== 'records') return
  root.querySelectorAll('.archive-document-card').forEach((card) => {
    const status = card.querySelector('.archive-document-card__top strong')?.textContent || ''
    card.dataset.trust = normalizeTrust(status)
  })
  root.querySelectorAll('.archive-documents__legend i').forEach((item) => { item.dataset.trust = normalizeTrust(item.textContent) })
}

const enhanceRecordOverlay = () => {
  const overlay = document.querySelector('[data-document-overlay]')
  if (!overlay || overlay.hidden) return
  const id = overlay.querySelector('[data-doc-id]')?.textContent?.trim()
  const status = overlay.querySelector('[data-doc-status]')?.textContent || ''
  const sheet = overlay.querySelector('.archive-document-sheet')
  if (!sheet || !id) return
  sheet.dataset.trust = normalizeTrust(status)

  let extract = sheet.querySelector('[data-record-extract]')
  if (!extract) {
    extract = document.createElement('section')
    extract.className = 'archive-record-extract'
    extract.dataset.recordExtract = ''
    sheet.querySelector('.archive-document-sheet__redactions')?.after(extract)
  }
  const rows = recordExtracts[id] || []
  extract.innerHTML = `<header><span>RECOVERED EXTRACT / SOURCE TRACE</span><i>${id}</i></header><div>${rows.map(([key,value]) => `<p><span>${key}</span><strong>${value}</strong></p>`).join('')}</div>`
}

const eraForMarker = (marker = '') => {
  const value = marker.toUpperCase()
  if (value.includes('BEFORE 2158')) return 'origin'
  if (value.startsWith('2158')) return '2158'
  if (value.includes('6 MONTHS')) return 'interval'
  return '2164'
}

const eraDivider = (era) => {
  const labels = {
    origin:['ORIGIN','BEFORE 2158','THE SYSTEM BEFORE THE BREAK'],
    '2158':['2158','BLACKOUT ERA','SUPPRESSION / LOSS / REWRITTEN HISTORY'],
    interval:['INTERVAL','2158 → 2164','THE OFFICIAL STORY HARDENS'],
    '2164':['2164','MAIN STORY','THE RECORD BEGINS TO MOVE AGAIN']
  }
  const [year,phase,copy] = labels[era]
  const node = document.createElement('div')
  node.className = `archive-timeline-era archive-timeline-era--${era}`
  node.innerHTML = `<span>${year}</span><div><strong>${phase}</strong><small>${copy}</small></div>`
  return node
}

const enhanceTimeline = () => {
  if (currentCategory() !== 'timeline') return
  const line = root.querySelector('.archive-timeline-line')
  if (!line || line.dataset.polished === '1') return
  line.dataset.polished = '1'

  const events = [...line.querySelectorAll('.archive-timeline-event')]
  let lastEra = null
  events.forEach((event, index) => {
    const marker = event.querySelector('.archive-timeline-event__marker time')?.textContent || ''
    const era = eraForMarker(marker)
    event.dataset.era = era
    event.style.setProperty('--timeline-index', String(index + 1))
    if (era !== lastEra) {
      event.before(eraDivider(era))
      lastEra = era
    }

    const body = event.querySelector('.archive-timeline-event__body')
    if (!body) return
    const title = body.querySelector('h3')?.textContent?.trim() || ''
    const detail = [...body.children].find((node) => node.tagName === 'SMALL')
    const tags = [...body.children].find((node) => node.tagName === 'DIV')
    const chapterLink = [...body.children].find((node) => node.tagName === 'A')

    const toggle = document.createElement('button')
    toggle.className = 'archive-timeline-event__toggle'
    toggle.type = 'button'
    toggle.dataset.timelineToggle = ''
    toggle.setAttribute('aria-expanded','false')
    toggle.innerHTML = '<span>EXPAND RECORD</span><i>＋</i>'

    const details = document.createElement('div')
    details.className = 'archive-timeline-event__details'
    details.hidden = true
    if (detail) details.appendChild(detail)
    if (tags) details.appendChild(tags)

    const links = document.createElement('div')
    links.className = 'archive-timeline-event__links'
    if (chapterLink) links.appendChild(chapterLink)
    const recordId = timelineRecordLinks[title]
    if (recordId) {
      const recordButton = document.createElement('button')
      recordButton.type = 'button'
      recordButton.dataset.timelineRecord = recordId
      recordButton.textContent = 'OPEN RELATED RECORD ›'
      links.appendChild(recordButton)
    }
    if (links.children.length) details.appendChild(links)
    body.append(toggle, details)
  })
}

const toggleTimelineEvent = (button) => {
  const event = button.closest('.archive-timeline-event')
  const details = event?.querySelector('.archive-timeline-event__details')
  if (!event || !details) return
  const open = !event.classList.contains('is-expanded')
  event.classList.toggle('is-expanded', open)
  button.setAttribute('aria-expanded', open ? 'true' : 'false')
  button.querySelector('span').textContent = open ? 'COLLAPSE RECORD' : 'EXPAND RECORD'
  button.querySelector('i').textContent = open ? '−' : '＋'
  details.hidden = !open
}

const openRelatedRecord = (recordId) => {
  const recordsButton = root.querySelector('[data-archive-category="records"]')
  recordsButton?.click()
  requestAnimationFrame(() => {
    const card = root.querySelector(`[data-document-id="${recordId}"]`)
    card?.click()
  })
}

const locationKeyForCard = (card) => card.querySelector('.archive-record__copy h3')?.textContent?.trim().toUpperCase() || ''

const enhanceLocations = () => {
  if (currentCategory() !== 'locations') return
  root.querySelectorAll('.archive-record--location').forEach((card) => {
    if (card.dataset.locationReady === '1') return
    const key = locationKeyForCard(card)
    const location = locations[key]
    if (!location) return
    card.dataset.locationReady = '1'
    card.dataset.locationKey = key
    card.setAttribute('role','button')
    card.setAttribute('tabindex','0')
    card.setAttribute('aria-label',`Open location dossier for ${location.title}`)
    card.insertAdjacentHTML('beforeend','<span class="archive-location-open-hint" aria-hidden="true">OPEN LOCATION FILE ↗</span>')
    const image = card.querySelector('img')
    if (image) { image.loading = 'lazy'; image.decoding = 'async' }
  })
}

const ensureLocationOverlay = () => {
  let overlay = document.querySelector('[data-location-overlay]')
  if (overlay) return overlay
  overlay = document.createElement('div')
  overlay.className = 'archive-location-overlay'
  overlay.dataset.locationOverlay = ''
  overlay.hidden = true
  overlay.setAttribute('role','dialog')
  overlay.setAttribute('aria-modal','true')
  overlay.setAttribute('aria-labelledby','archive-location-title')
  overlay.innerHTML = `
    <div class="archive-location-overlay__backdrop" data-location-close></div>
    <article class="archive-location-dossier">
      <button class="archive-location-dossier__close" type="button" data-location-close aria-label="Close location dossier">×</button>
      <div class="archive-location-dossier__art"><img src="" alt="" data-location-image /><div aria-hidden="true"></div></div>
      <div class="archive-location-dossier__content">
        <header><span data-location-id></span><i>VESPER ARCHIVE / LOCATION RECORD</i></header>
        <section class="archive-location-dossier__title"><small data-location-subtitle></small><h2 id="archive-location-title" data-location-title></h2></section>
        <dl data-location-fields></dl>
        <section class="archive-location-dossier__copy"><article><span>LOCATION PROFILE</span><p data-location-bio></p></article><article><span>STORY SIGNIFICANCE</span><p data-location-significance></p></article></section>
        <footer><span>RELATED CHAPTERS</span><div data-location-chapters></div></footer>
      </div>
    </article>`
  document.body.appendChild(overlay)
  return overlay
}

const openLocation = (location, trigger) => {
  if (!location) return
  locationPreviousFocus = trigger || document.activeElement
  const overlay = ensureLocationOverlay()
  const set = (selector,value) => { const node = overlay.querySelector(selector); if (node) node.textContent = value }
  const image = overlay.querySelector('[data-location-image]')
  if (image) { image.src = location.image; image.alt = location.title }
  set('[data-location-id]',location.id)
  set('[data-location-subtitle]',location.subtitle)
  set('[data-location-title]',location.title)
  set('[data-location-bio]',location.bio)
  set('[data-location-significance]',location.significance)
  const fields = overlay.querySelector('[data-location-fields]')
  if (fields) fields.innerHTML = location.fields.map(([label,value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')
  const chapters = overlay.querySelector('[data-location-chapters]')
  if (chapters) chapters.innerHTML = location.chapters.map((code) => `<a href="${getChapterHref(code)}">${code}</a>`).join('')
  overlay.hidden = false
  requestAnimationFrame(() => overlay.classList.add('is-open'))
  document.body.classList.add('archive-location-open')
  overlay.querySelector('[data-location-close]')?.focus({ preventScroll:true })
}

const closeLocation = () => {
  const overlay = document.querySelector('[data-location-overlay]')
  if (!overlay || overlay.hidden) return
  overlay.classList.remove('is-open')
  document.body.classList.remove('archive-location-open')
  window.setTimeout(() => { overlay.hidden = true }, 220)
  locationPreviousFocus?.focus?.({ preventScroll:true })
}

const sync = () => {
  if (!root?.children.length) return
  const category = currentCategory()
  if (category === 'records') enhanceRecords()
  if (category === 'timeline') enhanceTimeline()
  if (category === 'locations') enhanceLocations()
}

const queue = () => {
  if (queued) return
  queued = true
  requestAnimationFrame(() => { queued = false; sync() })
}

const initialize = () => {
  if (!root) return
  root.addEventListener('click', (event) => {
    const timelineToggle = event.target.closest('[data-timeline-toggle]')
    if (timelineToggle) { toggleTimelineEvent(timelineToggle); return }
    const relatedRecord = event.target.closest('[data-timeline-record]')
    if (relatedRecord) { openRelatedRecord(relatedRecord.dataset.timelineRecord); return }
    const locationCard = event.target.closest('.archive-record--location[data-location-ready="1"]')
    if (locationCard && currentCategory() === 'locations') {
      openLocation(locations[locationCard.dataset.locationKey], locationCard)
      return
    }
    if (event.target.closest('[data-document-id]')) requestAnimationFrame(enhanceRecordOverlay)
    if (event.target.closest('[data-archive-category]')) queue()
  })

  root.addEventListener('keydown', (event) => {
    const card = event.target.closest('.archive-record--location[data-location-ready="1"]')
    if (!card || currentCategory() !== 'locations' || !['Enter',' '].includes(event.key)) return
    event.preventDefault()
    openLocation(locations[card.dataset.locationKey], card)
  })

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-location-close]')) closeLocation()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLocation()
  })

  const observer = new MutationObserver(queue)
  observer.observe(root, { childList:true, subtree:true })
  window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
  window.addEventListener('pageshow', queue)
  queue()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
