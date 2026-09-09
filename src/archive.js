import './styles/site.css'
import './styles/archive-mode.css'

const base = import.meta.env.BASE_URL
const root = document.querySelector('#archive-app')
const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'

const getStoredSet = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(value) ? value : [])
  } catch {
    return new Set()
  }
}

const completed = getStoredSet(completionStorageKey)
const started = getStoredSet(startedStorageKey)

const chapters = {
  '01A': { href: './chapter.html?chapter=01A', image: './images/landing/vesper-city.png', location: 'VESPER CITY' },
  '01B': { href: './chapter.html?chapter=01B', image: './images/tracks/hero.png', location: 'BORDER DISTRICT' },
  '01C': { href: './chapter.html?chapter=01C', image: './images/tracks/01c-second-look/hero.png', location: 'HALO REVIEW CHAMBER' }
}

const characters = [
  {
    id: 'CHAR-01',
    title: 'HAN JIWON',
    subtitle: 'AEGIS / HALO GUARD',
    body: 'An elite HALO Guard officer built around protection, precision and discipline. The more closely he examines Taeyun, the less the official record behaves like certainty.',
    tags: ['PROTECTION', 'HALO', 'AEGIS'],
    image: './images/tracks/01c-second-look/hero.png'
  },
  {
    id: 'CHAR-02',
    title: 'KANG TAEYUN',
    subtitle: 'THE ARCHITECT / ECLIPSE',
    body: 'A former HALO insider turned Eclipse strategist. He pursues the truth through methods he refuses to call innocent and begins the story with Jiwon already inside a plan.',
    tags: ['TRUTH', 'ECLIPSE', 'ARCHITECT'],
    image: './images/tracks/hero.png'
  },
  {
    id: 'CHAR-03',
    title: 'HAN SEOJUN',
    subtitle: 'HALO MARTYR / BLACKOUT RECORD',
    body: 'Jiwon’s older brother. Publicly remembered as a HALO martyr, privately tied to evidence that contradicts the official story of the Blackout.',
    tags: ['BLACKOUT', 'SEojUN'.toUpperCase(), 'SEALED'],
    image: './images/world/halo-headquarters.png'
  }
]

const locations = [
  {
    id: 'LOC-00', title: 'VESPER CITY', subtitle: 'PRIMARY SETTING / 2164',
    body: 'A surveillance metropolis built on the promise that enough certainty can keep everyone safe. Its cleanest systems hide the messiest decisions.',
    tags: ['CITY', '2164', 'THE LINE'], image: './images/landing/vesper-city.png'
  },
  {
    id: 'LOC-01', title: 'HALO HEADQUARTERS', subtitle: 'CONTROL GRID / CIVIC AUTHORITY',
    body: 'White, silver and symmetrical by design. HALO presents protection as architecture: beautiful, legible and almost impossible to question from inside it.',
    tags: ['HALO', 'ORDER', 'SURVEILLANCE'], image: './images/world/halo-headquarters.png'
  },
  {
    id: 'LOC-02', title: 'ECLIPSE HUB', subtitle: 'SHADOW GRID / OLD TRANSIT',
    body: 'A repurposed underground transit network where obsolete infrastructure and advanced systems coexist outside HALO’s clean geometry.',
    tags: ['ECLIPSE', 'SHADOW GRID', 'RESISTANCE'], image: './images/world/eclipse-headquarters.png'
  },
  {
    id: 'LOC-03', title: 'THE OBSERVATORY', subtitle: 'NEUTRAL GROUND / RECURRING LOCATION',
    body: 'A recurring neutral space where ideological confrontation gradually becomes voluntary proximity, vulnerability and intimacy.',
    tags: ['OBSERVATORY', 'NEUTRAL', 'INTIMACY'], image: './images/landing/vesper-city.png'
  }
]

const timeline = [
  ['2158', 'THE BLACKOUT', 'Taeyun’s attempt to expose HALO collides with a Council-controlled blackout. Seojun dies and the official record is rewritten around a convenient villain.'],
  ['2164', 'FIRST CONTACT', 'Taeyun’s long-planned observation of Jiwon becomes unstable the moment Jiwon chooses a civilian over tactical advantage.'],
  ['2164', 'THE LINE FRACTURES', 'Recognition becomes fascination, attraction, intimacy, betrayal and finally a choice neither HALO nor Eclipse gets to make for them.'],
  ['2164', 'HALO CORE', 'The complete archive is released. Vesper wakes to truth without the comfort of immediate repair.']
]

const notes = [
  ['THE LINE', 'Political boundary, moral category, physical distance and romantic threshold. In the finale it stops being a rule imposed by the city and becomes a choice.'],
  ['STAY', 'Jiwon’s emotional key word. Protection evolves into presence without ownership.'],
  ['TRUTH', 'Taeyun’s core value and central contradiction: he lies and manipulates in order to reach it.'],
  ['HANDS', 'A recurring visual and lyrical motif for restraint, care, control, consent and trust.'],
  ['HALO / ECLIPSE', 'Not angel and demon. They are competing systems of order and resistance, both capable of moral failure.']
]

const categories = [
  ['all', 'ALL RECORDS', '00'],
  ['chapters', 'CHAPTERS', '01'],
  ['characters', 'CHARACTERS', '02'],
  ['locations', 'LOCATIONS', '03'],
  ['music', 'MUSIC', '04'],
  ['visuals', 'VISUALS', '05'],
  ['notes', 'NOTES', '06'],
  ['timeline', 'TIMELINE', '07']
]

const statusFor = (id) => completed.has(id) ? 'COMPLETE' : started.has(id) ? 'IN PROGRESS' : id === '01A' ? 'NOT STARTED' : 'AVAILABLE'

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const renderRecordCard = (record, kind = 'record') => `
  <article class="archive-record archive-record--${kind}">
    <div class="archive-record__image" aria-hidden="true"><img src="${record.image}" alt="" /></div>
    <div class="archive-record__shade" aria-hidden="true"></div>
    <div class="archive-record__copy">
      <span>${record.id}</span>
      <small>${record.subtitle}</small>
      <h3>${record.title}</h3>
      <p>${record.body}</p>
      <div>${record.tags.map((tag) => `<i>${tag}</i>`).join('')}</div>
    </div>
  </article>
`

const renderChapterCard = (track) => {
  const detail = chapters[track.id]
  const playable = Boolean(detail)
  return `
    <article class="archive-chapter ${playable ? 'is-available' : 'is-record-only'}">
      <div class="archive-chapter__art" aria-hidden="true">
        <img src="${detail?.image || (track.pov === 'jiwon' ? './images/world/halo-headquarters.png' : track.pov === 'taeyun' ? './images/world/eclipse-headquarters.png' : './images/landing/vesper-city.png')}" alt="" />
      </div>
      <div class="archive-chapter__shade" aria-hidden="true"></div>
      <div class="archive-chapter__head"><span>${track.id}</span><span>${track.actLabel.toUpperCase()}</span></div>
      <div class="archive-chapter__copy">
        <small>${track.povLabel.toUpperCase()} / ${escapeHtml(track.relationshipStage).toUpperCase()}</small>
        <h3>${escapeHtml(track.title)}</h3>
        <p>${escapeHtml(track.summary)}</p>
      </div>
      <div class="archive-chapter__foot">
        <span>${playable ? statusFor(track.id) : 'ARCHIVE RECORD'}</span>
        ${playable ? `<a href="${detail.href}">OPEN CHAPTER ›</a>` : `<span>${track.id}</span>`}
      </div>
    </article>
  `
}

const renderMusicRow = (track) => `
  <article class="archive-music-row">
    <span>${track.id}</span>
    <div><small>${track.actLabel.toUpperCase()} / ${track.povLabel.toUpperCase()}</small><strong>${escapeHtml(track.title)}</strong></div>
    <span>${escapeHtml(track.relationshipStage).toUpperCase()}</span>
    ${chapters[track.id] ? `<a href="${chapters[track.id].href}">DETAILS ›</a>` : '<span>RECORD</span>'}
  </article>
`

const renderTimeline = () => timeline.map(([year, title, body], index) => `
  <article class="archive-timeline__item">
    <span>${String(index + 1).padStart(2, '0')}</span>
    <time>${year}</time>
    <div><h3>${title}</h3><p>${body}</p></div>
  </article>
`).join('')

const renderNotes = () => notes.map(([title, body], index) => `
  <article class="archive-note">
    <span>${String(index + 1).padStart(2, '0')}</span>
    <h3>${title}</h3>
    <p>${body}</p>
  </article>
`).join('')

const renderEmpty = (label) => `
  <section class="archive-pending">
    <span>ARCHIVE / ${label}</span>
    <h2>RECORDS PENDING</h2>
    <p>This category is part of the archive structure, but no additional canon records have been loaded yet.</p>
  </section>
`

let tracks = []
let activeCategory = 'all'
let searchTerm = ''

const getFilteredTracks = () => {
  if (!searchTerm) return tracks
  const q = searchTerm.toLowerCase()
  return tracks.filter((track) => [track.id, track.title, track.povLabel, track.actLabel, track.summary, track.relationshipStage]
    .join(' ').toLowerCase().includes(q))
}

const renderSection = () => {
  const target = root.querySelector('[data-archive-content]')
  const title = root.querySelector('[data-archive-title]')
  const count = root.querySelector('[data-archive-count]')
  if (!target || !title || !count) return

  const filteredTracks = getFilteredTracks()
  const activeLabel = categories.find(([key]) => key === activeCategory)?.[1] || 'ALL RECORDS'
  title.textContent = activeLabel

  let html = ''
  let total = 0

  if (activeCategory === 'all') {
    total = 3 + 3 + filteredTracks.length
    html = `
      <section class="archive-featured">
        <article class="archive-featured__blackout">
          <div aria-hidden="true"><img src="./images/landing/vesper-city.png" alt="" /></div>
          <span>SEALED RECORD / 2158</span>
          <h2>THE BLACKOUT</h2>
          <p>The event that defines Vesper’s official Hero and Villain story is also the archive most capable of destroying it.</p>
          <strong>STATUS / RECORD FRAGMENTED</strong>
        </article>
        <article class="archive-featured__system"><span>HALO PROTOCOL</span><strong>SAFETY THROUGH CERTAINTY.</strong><small>AUTHORITY / HALO COUNCIL</small></article>
        <article class="archive-featured__system archive-featured__system--eclipse"><span>ECLIPSE</span><strong>QUESTION. DISRUPT. RECLAIM.</strong><small>NETWORK / SHADOW GRID</small></article>
      </section>
      <div class="archive-subhead"><span>PRIMARY PEOPLE</span><i></i></div>
      <div class="archive-record-grid">${characters.slice(0,2).map((record) => renderRecordCard(record, 'person')).join('')}</div>
      <div class="archive-subhead"><span>STORY RECORDS</span><i></i></div>
      <div class="archive-chapter-grid">${filteredTracks.map(renderChapterCard).join('')}</div>
    `
  } else if (activeCategory === 'chapters') {
    total = filteredTracks.length
    html = `<div class="archive-chapter-grid">${filteredTracks.map(renderChapterCard).join('')}</div>`
  } else if (activeCategory === 'characters') {
    total = characters.length
    html = `<div class="archive-record-grid">${characters.map((record) => renderRecordCard(record, 'person')).join('')}</div>`
  } else if (activeCategory === 'locations') {
    total = locations.length
    html = `<div class="archive-record-grid">${locations.map((record) => renderRecordCard(record, 'location')).join('')}</div>`
  } else if (activeCategory === 'music') {
    total = filteredTracks.length
    html = `<div class="archive-music">${filteredTracks.map(renderMusicRow).join('')}</div>`
  } else if (activeCategory === 'visuals') {
    total = 6
    html = `<div class="archive-visual-grid">
      ${[
        ['./images/landing/vesper-city.png','VESPER CITY','WORLD / 2164'],
        ['./images/world/halo-headquarters.png','HALO HEADQUARTERS','WORLD / HALO'],
        ['./images/world/eclipse-headquarters.png','ECLIPSE HUB','WORLD / ECLIPSE'],
        ['./images/tracks/hero.png','FIRST CONTACT','01B / TAEYUN POV'],
        ['./images/tracks/01c-second-look/hero.png','SECOND LOOK','01C / JIWON POV'],
        ['./images/landing/when-halos-burn-title-exact.png','WHEN HALOS BURN','TITLE / MASTER']
      ].map(([image,title,meta]) => `<figure><img src="${image}" alt="${title}" /><figcaption><span>${meta}</span><strong>${title}</strong></figcaption></figure>`).join('')}
    </div>`
  } else if (activeCategory === 'notes') {
    total = notes.length
    html = renderNotes()
  } else if (activeCategory === 'timeline') {
    total = timeline.length
    html = `<div class="archive-timeline">${renderTimeline()}</div>`
  } else {
    html = renderEmpty(activeLabel)
  }

  target.innerHTML = html || renderEmpty(activeLabel)
  count.textContent = `${total} RECORD${total === 1 ? '' : 'S'}`
}

const buildShell = () => {
  root.innerHTML = `
    <header class="archive-topbar">
      <a class="archive-topbar__identity" href="./index.html" aria-label="WHEN HALOS BURN home">
        <span class="archive-topbar__mark" aria-hidden="true"></span>
        <span><b>A CINEMATIC</b><b>CONCEPT ALBUM</b></span>
      </a>
      <nav class="archive-topbar__nav" aria-label="Primary navigation">
        <a href="./index.html">HOME</a>
        <a href="./story.html#story-hub">STORY MODE</a>
        <a class="is-active" href="./archive.html">ARCHIVE MODE</a>
        <a href="./story.html#vesper">WORLD</a>
        <span aria-disabled="true">EXTRAS</span>
      </nav>
      <div class="archive-topbar__city"><span>VESPER CITY</span><span>2164</span><i></i></div>
    </header>

    <section class="archive-hero">
      <div class="archive-hero__art" aria-hidden="true"><img src="./images/landing/vesper-city.png" alt="" /></div>
      <div class="archive-hero__shade" aria-hidden="true"></div>
      <div class="archive-hero__copy">
        <p>ARCHIVE MODE / VESPER DATABASE</p>
        <h1>VESPER<br /><span>ARCHIVE</span></h1>
        <strong>BREAK THE SEQUENCE. FOLLOW THE RECORD.</strong>
      </div>
      <div class="archive-hero__status"><span>ARCHIVE ACCESS</span><strong>PARTIAL / ACTIVE</strong></div>
    </section>

    <section class="archive-workspace">
      <aside class="archive-sidebar">
        <div class="archive-sidebar__head"><span>DATABASE</span><strong>INDEX</strong></div>
        <nav aria-label="Archive categories">
          ${categories.map(([key,label,index]) => `<button class="${key === activeCategory ? 'is-active' : ''}" type="button" data-archive-category="${key}"><span>${index}</span>${label}</button>`).join('')}
        </nav>
        <div class="archive-sidebar__foot"><span>HALO / ECLIPSE</span><span>RECORD STATE / UNSTABLE</span></div>
      </aside>

      <main class="archive-main">
        <div class="archive-toolbar">
          <div><span>ARCHIVE CATEGORY</span><h2 data-archive-title>ALL RECORDS</h2></div>
          <label class="archive-search"><span>SEARCH RECORDS</span><input type="search" placeholder="Search title, POV, act…" data-archive-search /></label>
          <span data-archive-count>0 RECORDS</span>
        </div>
        <div class="archive-content" data-archive-content></div>
      </main>
    </section>

    <nav class="archive-mobile-dock" aria-label="Mobile navigation">
      <a href="./index.html"><i>⌂</i><span>HOME</span></a>
      <a href="./story.html#story-hub"><i>▣</i><span>STORY</span></a>
      <a class="is-active" href="./archive.html"><i>▤</i><span>ARCHIVE</span></a>
      <a href="./story.html#vesper"><i>◎</i><span>WORLD</span></a>
      <span aria-disabled="true"><i>◇</i><span>EXTRAS</span></span>
    </nav>
  `

  root.querySelectorAll('[data-archive-category]').forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.archiveCategory
      root.querySelectorAll('[data-archive-category]').forEach((item) => item.classList.toggle('is-active', item === button))
      renderSection()
      if (window.innerWidth < 820) root.querySelector('.archive-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  root.querySelector('[data-archive-search]')?.addEventListener('input', (event) => {
    searchTerm = event.currentTarget.value.trim()
    if (!['all','chapters','music'].includes(activeCategory)) activeCategory = 'all'
    root.querySelectorAll('[data-archive-category]').forEach((item) => item.classList.toggle('is-active', item.dataset.archiveCategory === activeCategory))
    renderSection()
  })
}

async function init() {
  try {
    const response = await fetch(`${base}data/tracks.json`)
    if (!response.ok) throw new Error('Failed to load archive records')
    tracks = (await response.json()).sort((a,b) => a.order - b.order)
    buildShell()
    renderSection()
  } catch (error) {
    console.error(error)
    root.innerHTML = '<section class="archive-fatal"><span>ARCHIVE ERROR</span><h1>DATABASE UNAVAILABLE</h1><a href="./index.html">RETURN HOME</a></section>'
  }
}

init()
