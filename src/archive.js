import './styles/site.css'
import './styles/archive-mode.css'
import { chapterList, getChapterHref } from './chapter-data.js'

const root = document.querySelector('#archive-app')
const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'

const getStoredSet = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(value) ? value : [])
  } catch { return new Set() }
}

const characters = [
  {
    id:'CHAR-01', title:'HAN JIWON', subtitle:'AEGIS / HALO GUARD',
    body:'An elite HALO Guard officer built around protection, precision and discipline. The closer he examines the official story, the less certainty behaves like evidence.',
    tags:['PROTECTION','HALO','AEGIS'], image:'./images/archive/characters/han-jiwon.png'
  },
  {
    id:'CHAR-02', title:'KANG TAEYUN', subtitle:'THE ARCHITECT / ECLIPSE',
    body:'A former HALO insider turned Eclipse strategist. He pursues the truth through methods he refuses to call innocent and begins with Jiwon already inside a plan.',
    tags:['TRUTH','ECLIPSE','ARCHITECT'], image:'./images/archive/characters/kang-taeyun.png'
  },
  {
    id:'CHAR-03', title:'HAN SEOJUN', subtitle:'HALO MARTYR / BLACKOUT RECORD',
    body:'Jiwon’s older brother. Publicly remembered as a HALO martyr, privately tied to evidence that contradicts the official account of the Blackout.',
    tags:['BLACKOUT','SEOJUN','SEALED'], image:'./images/archive/characters/han-seojun.png'
  }
]

const locations = [
  { id:'LOC-00', title:'VESPER CITY', subtitle:'PRIMARY SETTING / 2164', body:'A surveillance metropolis built on the promise that enough certainty can keep everyone safe. Its cleanest systems hide the messiest decisions.', tags:['CITY','2164','THE LINE'], image:'./images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png' },
  { id:'LOC-01', title:'HALO HEADQUARTERS', subtitle:'CONTROL GRID / CIVIC AUTHORITY', body:'White, silver and symmetrical by design. HALO presents protection as architecture: beautiful, legible and almost impossible to question from inside it.', tags:['HALO','ORDER','SURVEILLANCE'], image:'./images/world/halo-headquarters.png' },
  { id:'LOC-02', title:'ECLIPSE HUB', subtitle:'SHADOW GRID / OLD TRANSIT', body:'A repurposed underground transit network where obsolete infrastructure and advanced systems coexist outside HALO’s clean geometry.', tags:['ECLIPSE','SHADOW GRID','RESISTANCE'], image:'./images/world/eclipse-headquarters.png' },
  { id:'LOC-03', title:'THE OBSERVATORY', subtitle:'NEUTRAL GROUND / RECURRING LOCATION', body:'A recurring neutral space where ideological confrontation gradually becomes voluntary proximity, vulnerability and intimacy.', tags:['OBSERVATORY','NEUTRAL','INTIMACY'], image:'./images/archive/locations/observatory.png' },
  { id:'LOC-04', title:'HALO CORE', subtitle:'SEALED ARCHIVE / CENTRAL SYSTEM', body:'The institutional heart of HALO and the location of the complete archive capable of collapsing Vesper’s official Blackout narrative.', tags:['HALO CORE','ARCHIVE','TRUTH'], image:'./images/archive/locations/halo-core.png' }
]

const timeline = [
  ['2158','THE BLACKOUT','Taeyun’s attempt to expose HALO collides with a Council-controlled blackout. Seojun dies and the official record is rewritten around a convenient villain.'],
  ['2164','FIRST CONTACT','Taeyun’s planned observation of Jiwon destabilizes the moment Jiwon chooses a civilian over tactical advantage.'],
  ['2164','THE OBSERVATORY','Voluntary meetings turn ideology into proximity, then proximity into intimacy.'],
  ['2164','FAULT LINE','Jiwon discovers the original dossier, Seojun connection and architecture of Taeyun’s plan.'],
  ['2164','HALO CORE','The complete archive is released. Vesper wakes to truth without the comfort of immediate repair.'],
  ['2164','AFTERLIGHT','The city remains standing while Jiwon and Taeyun step outside the roles that once defined them.']
]

const notes = [
  ['THE LINE','Political boundary, moral category, physical distance and romantic threshold. In the end it stops being a rule imposed by the city and becomes a horizon.'],
  ['STAY','Jiwon’s emotional key word. Protection evolves into presence without ownership.'],
  ['TRUTH','Taeyun’s core value and central contradiction: he lies and manipulates in order to reach it.'],
  ['HANDS','A recurring visual and lyrical motif for restraint, care, control, consent and trust.'],
  ['NAMES','Aegis and Architect are roles. Jiwon and Taeyun are the names that remain when those roles lose authority.'],
  ['HALO / ECLIPSE','Not angel and demon. They are competing systems of order and resistance, both capable of moral failure.']
]

const categories = [
  ['chapters','CHAPTERS','01'],['characters','CHARACTERS','02'],['locations','LOCATIONS','03'],['music','MUSIC','04'],['visuals','VISUALS','05'],['notes','NOTES','06'],['timeline','TIMELINE','07']
]

let activeCategory = 'chapters'
let searchTerm = ''

const escapeHtml = (value='') => String(value)
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')

const statusFor = (code) => {
  const completed = getStoredSet(completionStorageKey)
  const started = getStoredSet(startedStorageKey)
  return completed.has(code) ? 'COMPLETE' : started.has(code) ? 'IN PROGRESS' : 'NOT STARTED'
}

const filteredChapters = () => {
  if (!searchTerm) return chapterList
  const q = searchTerm.toLowerCase()
  return chapterList.filter((chapter) => [chapter.code,chapter.title,chapter.perspective,chapter.act,chapter.location,chapter.relationshipStage,chapter.summary].join(' ').toLowerCase().includes(q))
}

const renderRecordCard = (record, kind='record') => `
  <article class="archive-record archive-record--${kind}">
    <div class="archive-record__image" aria-hidden="true"><img src="${record.image}" alt="" /></div>
    <div class="archive-record__shade" aria-hidden="true"></div>
    <div class="archive-record__copy">
      <span>${record.id}</span><small>${record.subtitle}</small><h3>${record.title}</h3><p>${record.body}</p>
      <div>${record.tags.map((tag) => `<i>${tag}</i>`).join('')}</div>
    </div>
  </article>
`

const renderChapterCard = (chapter) => `
  <article class="archive-chapter is-available">
    <div class="archive-chapter__art" aria-hidden="true"><img src="${chapter.image}" alt="" /></div>
    <div class="archive-chapter__shade" aria-hidden="true"></div>
    <div class="archive-chapter__head"><span>${chapter.display} / ${chapter.code}</span><span>${chapter.act}</span></div>
    <div class="archive-chapter__copy">
      <small>${chapter.perspective} / ${escapeHtml(chapter.relationshipStage)}</small>
      <h3>${escapeHtml(chapter.title)}</h3><p>${escapeHtml(chapter.summary)}</p>
    </div>
    <div class="archive-chapter__foot"><span>${statusFor(chapter.code)}</span><a href="${getChapterHref(chapter.code)}">OPEN CHAPTER ›</a></div>
  </article>
`

const renderMusicRow = (chapter) => `
  <article class="archive-music-row">
    <span>${chapter.code}</span>
    <div><small>${chapter.act} / ${chapter.perspective}</small><strong>${escapeHtml(chapter.title)}</strong></div>
    <span>${escapeHtml(chapter.relationshipStage)}</span>
    <a href="${getChapterHref(chapter.code)}">DETAILS ›</a>
  </article>
`

const renderTimeline = () => timeline.map(([year,title,body], index) => `
  <article class="archive-timeline__item"><span>${String(index+1).padStart(2,'0')}</span><time>${year}</time><div><h3>${title}</h3><p>${body}</p></div></article>
`).join('')

const renderNotes = () => notes.map(([title,body], index) => `
  <article class="archive-note"><span>${String(index+1).padStart(2,'0')}</span><h3>${title}</h3><p>${body}</p></article>
`).join('')

const renderVisuals = (items) => `
  <div class="archive-visual-grid">
    ${items.map((chapter) => `<figure><img src="${chapter.image}" alt="${escapeHtml(chapter.title)}" /><figcaption><span>${chapter.display} / ${chapter.code} / ${chapter.perspective}</span><strong>${escapeHtml(chapter.title)}</strong></figcaption></figure>`).join('')}
  </div>
`

const renderSection = () => {
  const target = root.querySelector('[data-archive-content]')
  const title = root.querySelector('[data-archive-title]')
  const count = root.querySelector('[data-archive-count]')
  if (!target || !title || !count) return

  const items = filteredChapters()
  const label = categories.find(([key]) => key === activeCategory)?.[1] || 'CHAPTERS'
  title.textContent = label
  let html = ''
  let total = 0

  if (activeCategory === 'chapters') {
    total = items.length; html = `<div class="archive-chapter-grid">${items.map(renderChapterCard).join('')}</div>`
  } else if (activeCategory === 'characters') {
    total = characters.length; html = `<div class="archive-record-grid">${characters.map((record) => renderRecordCard(record,'person')).join('')}</div>`
  } else if (activeCategory === 'locations') {
    total = locations.length; html = `<div class="archive-record-grid">${locations.map((record) => renderRecordCard(record,'location')).join('')}</div>`
  } else if (activeCategory === 'music') {
    total = items.length; html = `<div class="archive-music">${items.map(renderMusicRow).join('')}</div>`
  } else if (activeCategory === 'visuals') {
    total = items.length; html = renderVisuals(items)
  } else if (activeCategory === 'notes') {
    total = notes.length; html = renderNotes()
  } else if (activeCategory === 'timeline') {
    total = timeline.length; html = `<div class="archive-timeline">${renderTimeline()}</div>`
  }

  target.innerHTML = html
  count.textContent = `${total} RECORD${total === 1 ? '' : 'S'}`
}

const buildShell = () => {
  root.innerHTML = `
    <header class="archive-topbar">
      <a class="archive-topbar__identity" href="./index.html" aria-label="WHEN HALOS BURN home"><span class="archive-topbar__mark" aria-hidden="true"></span><span><b>A CINEMATIC</b><b>CONCEPT ALBUM</b></span></a>
      <nav class="archive-topbar__nav" aria-label="Primary navigation"><a href="./index.html">HOME</a><a href="./story.html#story-hub">STORY MODE</a><a class="is-active" href="./archive.html">ARCHIVE MODE</a><a href="./story.html?world=1#vesper">WORLD</a><span aria-disabled="true">EXTRAS</span></nav>
      <div class="archive-topbar__city"><span>VESPER CITY</span><span>2164</span><i></i></div>
    </header>

    <section class="archive-hero">
      <div class="archive-hero__art" aria-hidden="true"><img src="./images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png" alt="" /></div>
      <div class="archive-hero__shade" aria-hidden="true"></div>
      <div class="archive-hero__copy"><p>ARCHIVE MODE / VESPER DATABASE</p><h1>VESPER <span>ARCHIVE</span></h1><strong>BREAK THE SEQUENCE. FOLLOW THE RECORD.</strong></div>
      <div class="archive-hero__status"><span>ARCHIVE ACCESS</span><strong>COMPLETE / ACTIVE</strong></div>
    </section>

    <section class="archive-workspace">
      <aside class="archive-sidebar">
        <div class="archive-sidebar__head"><span>DATABASE</span><strong>INDEX</strong></div>
        <nav aria-label="Archive categories">${categories.map(([key,label,index]) => `<button class="${key === activeCategory ? 'is-active' : ''}" type="button" data-archive-category="${key}"><span>${index}</span>${label}</button>`).join('')}</nav>
        <div class="archive-sidebar__foot"><span>HALO / ECLIPSE</span><span>RECORD STATE / COMPLETE</span></div>
      </aside>

      <main class="archive-main">
        <div class="archive-toolbar">
          <div><span>ARCHIVE CATEGORY</span><h2 data-archive-title>CHAPTERS</h2></div>
          <label class="archive-search"><span>SEARCH RECORDS</span><input type="search" placeholder="Search title, POV, act…" data-archive-search /></label>
          <span data-archive-count>0 RECORDS</span>
        </div>
        <div class="archive-content" data-archive-content></div>
      </main>
    </section>

    <nav class="archive-mobile-dock" aria-label="Mobile navigation">
      <a href="./index.html"><i>⌂</i><span>HOME</span></a><a href="./story.html#story-hub"><i>▣</i><span>STORY</span></a><a class="is-active" href="./archive.html"><i>▤</i><span>ARCHIVE</span></a><a href="./story.html?world=1#vesper"><i>◎</i><span>WORLD</span></a><span aria-disabled="true"><i>◇</i><span>EXTRAS</span></span>
    </nav>
  `

  root.querySelectorAll('[data-archive-category]').forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.archiveCategory
    root.querySelectorAll('[data-archive-category]').forEach((item) => item.classList.toggle('is-active', item === button))
    renderSection()
    if (window.innerWidth < 760) root.querySelector('.archive-main')?.scrollIntoView({ behavior:'smooth', block:'start' })
  }))

  root.querySelector('[data-archive-search]')?.addEventListener('input', (event) => {
    searchTerm = event.target.value.trim()
    if (!['chapters','music','visuals'].includes(activeCategory) && searchTerm) {
      activeCategory = 'chapters'
      root.querySelectorAll('[data-archive-category]').forEach((item) => item.classList.toggle('is-active', item.dataset.archiveCategory === 'chapters'))
    }
    renderSection()
  })

  renderSection()
}

try { buildShell() } catch (error) {
  console.error(error)
  root.innerHTML = `<section class="archive-fatal"><span>ARCHIVE MODE</span><h1>DATABASE OFFLINE</h1><a href="./index.html">RETURN HOME</a></section>`
}

window.addEventListener('pageshow', renderSection)