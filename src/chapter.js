import './styles/site.css'
import './styles/chapter-detail.css'

const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'

const chapters = {
  '01A': {
    display: '01',
    code: '01A',
    title: 'PROLOGUE: THE LINE',
    titleLines: ['PROLOGUE:', 'THE LINE'],
    act: 'OPENING',
    perspective: 'NARRATOR',
    location: 'VESPER CITY',
    state: 'CLASSIFICATION / THE LINE',
    image: './images/landing/vesper-city.png',
    audio: './audio/tracks/01a-prologue-the-line.mp3',
    summary: 'Before either man speaks, Vesper has already decided what they mean.',
    overview: 'Vesper defines safety, order, heroism and threat before Jiwon and Taeyun ever meet. The opening establishes the line the city expects everyone to obey.',
    question: 'What happens when a category stops matching the person standing in front of you?',
    quote: 'No line stays simple once you know the face on the other side.',
    scenes: [
      ['01', 'SYSTEM', 'In Vesper, safety has a shape.'],
      ['02', 'SYSTEM', 'Order has a name: HALO.'],
      ['03', 'CLASSIFICATION', 'Everything beyond the approved line becomes easier to name than to understand.']
    ],
    visualLabel: 'VESPER CITY / NIGHT CYCLE',
    visualNote: 'The city is presented as beautiful, ordered and already divided by a single vertical axis.',
    notes: [
      ['FUNCTION', 'World introduction'],
      ['VOICE', 'Neutral narrator'],
      ['MOTIF', 'The Line'],
      ['STORY POSITION', 'Opening event']
    ]
  },
  '01B': {
    display: '02',
    code: '01B',
    title: 'FIRST CONTACT',
    titleLines: ['FIRST', 'CONTACT'],
    act: 'OPENING',
    perspective: 'TAEYUN',
    location: 'BORDER DISTRICT',
    state: 'RECOGNITION / CURIOSITY',
    image: './images/tracks/hero.png',
    audio: './audio/tracks/01b-first-contact.mp3',
    summary: 'The file told him who Jiwon was. The first choice tells him something else.',
    overview: 'Taeyun enters the encounter already knowing Jiwon by reputation and by file. Jiwon then gives up a tactical advantage to protect a civilian, forcing Taeyun to reconsider the man HALO records describe.',
    question: 'Why does Taeyun refuse to exploit the opening he was waiting for?',
    quote: 'Maybe the file left something out.',
    scenes: [
      ['01', 'THE FILE', 'Taeyun arrives already knowing who Han Jiwon is supposed to be.'],
      ['02', 'THE OPENING', 'Jiwon sacrifices the cleaner tactical position because a stranger needs shielding first.'],
      ['03', 'THE CHOICE', 'Taeyun could exploit it. He does not. Observation matters more than winning.']
    ],
    visualLabel: 'BORDER DISTRICT / FIRST CONTACT',
    visualNote: 'Jiwon protects first. Taeyun observes instead of taking the advantage.',
    notes: [
      ['FUNCTION', 'First meeting'],
      ['POV', 'Taeyun'],
      ['STAGE', 'Recognition / Curiosity'],
      ['KEY SHIFT', 'The file becomes insufficient']
    ]
  },
  '01C': {
    display: '03',
    code: '01C',
    title: 'SECOND LOOK',
    titleLines: ['SECOND', 'LOOK'],
    act: 'OPENING',
    perspective: 'JIWON',
    location: 'HALO REVIEW CHAMBER',
    state: 'ANALYSIS / DOUBT',
    image: './images/tracks/01c-second-look/hero.png',
    audio: './audio/tracks/01c-second-look.mp3',
    summary: 'The record is clear. The footage is not.',
    overview: 'Back inside HALO, Jiwon reviews the encounter and finds one detail he cannot reconcile with the official record: Taeyun saw the opening and chose not to take it.',
    question: 'What does a protector do when the evidence contradicts the certainty he was trained to trust?',
    quote: 'You had the opening. Why didn’t you take it?',
    scenes: [
      ['01', 'THE RECORD', 'Kang Taeyun is the Architect of the Blackout: a threat with a name, a history and a category.'],
      ['02', 'THE GAP', 'The footage returns to the same impossible detail. Taeyun saw the opening.'],
      ['03', 'THE QUESTION', 'Jiwon can explain an attack or retreat. He cannot explain a choice that contradicts the record.']
    ],
    visualLabel: 'HALO REVIEW / SECOND LOOK',
    visualNote: 'HALO remains precise and symmetrical while Jiwon’s certainty begins to fracture inside it.',
    notes: [
      ['FUNCTION', 'Counter-perspective'],
      ['POV', 'Jiwon'],
      ['STAGE', 'Analysis / Doubt'],
      ['KEY SHIFT', 'Certainty becomes a question']
    ]
  }
}

const getStoredSet = (key) => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(raw) ? raw : [])
  } catch {
    return new Set()
  }
}

const saveSet = (key, set) => {
  try {
    window.localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // The page remains usable when local storage is unavailable.
  }
}

const completed = getStoredSet(completionStorageKey)
const started = getStoredSet(startedStorageKey)

const params = new URLSearchParams(window.location.search)
const requestedCode = (params.get('chapter') || '01A').toUpperCase()
const chapter = chapters[requestedCode] || chapters['01A']

const getStatus = () => {
  if (completed.has(chapter.code)) return 'COMPLETE'
  if (started.has(chapter.code)) return 'IN PROGRESS'
  return 'NOT STARTED'
}

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--:--'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

const root = document.querySelector('#chapter-root')

document.title = `${chapter.title} — WHEN HALOS BURN`

const sceneCards = chapter.scenes.map(([index, label, copy]) => `
  <article class="chapter-scenes__card">
    <span>${index}</span>
    <div><small>${label}</small><p>${copy}</p></div>
  </article>
`).join('')

const notes = chapter.notes.map(([label, value]) => `
  <div><dt>${label}</dt><dd>${value}</dd></div>
`).join('')

root.innerHTML = `
  <header class="chapter-topbar">
    <a class="chapter-topbar__identity" href="./index.html" aria-label="WHEN HALOS BURN home">
      <span class="chapter-topbar__mark" aria-hidden="true"></span>
      <span><b>A CINEMATIC</b><b>CONCEPT ALBUM</b></span>
    </a>

    <nav class="chapter-topbar__nav" aria-label="Chapter navigation">
      <a href="./index.html">HOME</a>
      <a class="is-active" href="./story.html#story-hub">STORY MODE</a>
      <a href="./archive.html">ARCHIVE MODE</a>
      <a href="./story.html#vesper">WORLD</a>
      <span aria-disabled="true">EXTRAS</span>
    </nav>

    <div class="chapter-topbar__city"><span>VESPER CITY</span><span>2164</span><i aria-hidden="true"></i></div>
  </header>

  <section class="chapter-hero">
    <div class="chapter-hero__art" aria-hidden="true"><img src="${chapter.image}" alt="" /></div>
    <div class="chapter-hero__shade" aria-hidden="true"></div>
    <div class="chapter-hero__grid" aria-hidden="true"></div>

    <a class="chapter-hero__back" href="./story.html#story-hub">← BACK TO STORY MODE</a>

    <div class="chapter-hero__copy">
      <span class="chapter-hero__number">${chapter.display}</span>
      <div class="chapter-hero__title">
        <p>${chapter.act} / STORY CHAPTER</p>
        <h1>${chapter.titleLines.map((line) => `<span>${line}</span>`).join('')}</h1>
        <strong>${chapter.summary}</strong>
      </div>
    </div>

    <div class="chapter-hero__edge" aria-hidden="true"><span>THE LINE</span><i></i><span>${chapter.code}</span></div>
  </section>

  <section class="chapter-command">
    <dl class="chapter-command__meta">
      <div><dt>PERSPECTIVE</dt><dd>${chapter.perspective}</dd></div>
      <div><dt>LOCATION</dt><dd>${chapter.location}</dd></div>
      <div><dt>DURATION</dt><dd data-duration>--:--</dd></div>
      <div><dt>STATUS</dt><dd data-chapter-status>${getStatus()}</dd></div>
    </dl>

    <a class="chapter-command__start" href="./story.html#episode-${chapter.code.toLowerCase()}" data-start-chapter>
      <span>▶</span><strong>${completed.has(chapter.code) ? 'REPLAY CHAPTER' : started.has(chapter.code) ? 'CONTINUE CHAPTER' : 'START CHAPTER'}</strong><i>›</i>
    </a>
  </section>

  <section class="chapter-content">
    <nav class="chapter-tabs" role="tablist" aria-label="Chapter information">
      <button class="is-active" type="button" role="tab" aria-selected="true" data-tab="overview">OVERVIEW</button>
      <button type="button" role="tab" aria-selected="false" data-tab="scenes">SCENES</button>
      <button type="button" role="tab" aria-selected="false" data-tab="lyrics">LYRICS</button>
      <button type="button" role="tab" aria-selected="false" data-tab="visuals">VISUALS</button>
      <button type="button" role="tab" aria-selected="false" data-tab="notes">NOTES</button>
    </nav>

    <div class="chapter-panels">
      <section class="chapter-panel is-active" role="tabpanel" data-panel="overview">
        <div class="chapter-overview__copy">
          <p class="chapter-panel__eyebrow">CHAPTER OVERVIEW</p>
          <h2>${chapter.title}</h2>
          <p>${chapter.overview}</p>
        </div>
        <aside class="chapter-overview__question">
          <span>CORE QUESTION</span>
          <strong>${chapter.question}</strong>
        </aside>
        <blockquote><span>KEY LINE</span>“${chapter.quote}”</blockquote>
      </section>

      <section class="chapter-panel" role="tabpanel" data-panel="scenes" hidden>
        <p class="chapter-panel__eyebrow">SCENE SEQUENCE</p>
        <h2>STORY BEATS</h2>
        <div class="chapter-scenes">${sceneCards}</div>
      </section>

      <section class="chapter-panel chapter-panel--empty" role="tabpanel" data-panel="lyrics" hidden>
        <span>LYRICS / ${chapter.code}</span>
        <h2>LYRICS NOT LOADED</h2>
        <p>The final lyric text has not been added to this chapter screen yet.</p>
      </section>

      <section class="chapter-panel" role="tabpanel" data-panel="visuals" hidden>
        <p class="chapter-panel__eyebrow">VISUAL RECORD</p>
        <h2>${chapter.visualLabel}</h2>
        <figure class="chapter-visual">
          <img src="${chapter.image}" alt="${chapter.title} visual" />
          <figcaption>${chapter.visualNote}</figcaption>
        </figure>
      </section>

      <section class="chapter-panel" role="tabpanel" data-panel="notes" hidden>
        <p class="chapter-panel__eyebrow">STORY DATA</p>
        <h2>CHAPTER NOTES</h2>
        <dl class="chapter-notes">${notes}</dl>
      </section>
    </div>
  </section>

  <nav class="chapter-mobile-dock" aria-label="Mobile navigation">
    <a href="./index.html"><i>⌂</i><span>HOME</span></a>
    <a class="is-active" href="./story.html#story-hub"><i>▣</i><span>STORY</span></a>
    <a href="./archive.html"><i>▤</i><span>ARCHIVE</span></a>
    <a href="./story.html#vesper"><i>◎</i><span>WORLD</span></a>
    <span aria-disabled="true"><i>◇</i><span>EXTRAS</span></span>
  </nav>
`

const tabs = [...root.querySelectorAll('[data-tab]')]
const panels = [...root.querySelectorAll('[data-panel]')]

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab
    tabs.forEach((item) => {
      const active = item === tab
      item.classList.toggle('is-active', active)
      item.setAttribute('aria-selected', String(active))
    })
    panels.forEach((panel) => {
      const active = panel.dataset.panel === key
      panel.classList.toggle('is-active', active)
      panel.hidden = !active
    })
  })
})

root.querySelector('[data-start-chapter]')?.addEventListener('click', () => {
  if (!completed.has(chapter.code)) {
    started.add(chapter.code)
    saveSet(startedStorageKey, started)
  }
})

const statusEl = root.querySelector('[data-chapter-status]')
if (statusEl) statusEl.textContent = getStatus()

const durationEl = root.querySelector('[data-duration]')
const audio = new Audio()
audio.preload = 'metadata'
audio.src = chapter.audio
audio.addEventListener('loadedmetadata', () => {
  if (durationEl) durationEl.textContent = formatDuration(audio.duration)
})
audio.addEventListener('error', () => {
  if (durationEl) durationEl.textContent = '--:--'
})

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(pointer: fine)').matches) {
  const hero = root.querySelector('.chapter-hero')
  const art = root.querySelector('.chapter-hero__art img')
  hero?.addEventListener('pointermove', (event) => {
    if (!art) return
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    art.style.transform = `scale(1.045) translate(${x * -8}px, ${y * -4}px)`
  })
  hero?.addEventListener('pointerleave', () => {
    if (art) art.style.transform = 'scale(1.035)'
  })
}
