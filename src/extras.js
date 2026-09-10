import './styles/site.css'
import './styles/extras-mode.css'
import { actMeta, chapterList } from './chapter-data.js'

const root = document.querySelector('#extras-app')

const conceptFrames = [
  { code:'VD-01', title:'VESPER CITY', role:'CITY / VISUAL LANGUAGE', image:'./images/landing/vesper-city.png', note:'The world is introduced through scale, glass, lines and beautiful systems rather than obvious decay.' },
  { code:'VD-02', title:'HALO', role:'ARCHITECTURE / ORDER', image:'./images/world/halo-headquarters.png', note:'Symmetry, pale materials and controlled circular geometry make authority feel elegant before it feels threatening.' },
  { code:'VD-03', title:'ECLIPSE', role:'ARCHITECTURE / RESISTANCE', image:'./images/world/eclipse-headquarters.png', note:'Older infrastructure, asymmetry and selective light create a visual language built from what Vesper stopped prioritizing.' },
  { code:'VD-04', title:'HAN JIWON', role:'CHARACTER / PROTECTION', image:'./images/archive/characters/han-jiwon.png', note:'Frontal control, clean structure and restraint place Jiwon visually inside HALO before the frame begins to loosen around him.' },
  { code:'VD-05', title:'KANG TAEYUN', role:'CHARACTER / DISRUPTION', image:'./images/archive/characters/kang-taeyun.png', note:'Off-center composition, reflections and darker layering let Taeyun feel unstable without turning him into a visual cliché.' },
  { code:'VD-06', title:'HALO CORE', role:'FINALE / INSTITUTIONAL MEMORY', image:'./images/archive/locations/halo-core.png', note:'The truth is hidden inside the most beautiful expression of the system: order, certainty and classification made architectural.' }
]

const bonusFrames = [
  { code:'PR-01', title:'FIRST CONTACT', image:'./images/tracks/01b-first-contact/hero.png', meta:'OPENING / TAEYUN POV' },
  { code:'PR-02', title:'CROSSFIRE', image:'./images/tracks/04-crossfire/hero.png', meta:'ACT I / PROXIMITY' },
  { code:'PR-03', title:'AFTER CURFEW', image:'./images/tracks/05-after-curfew/hero.png', meta:'ACT II / TEMPTATION' },
  { code:'PR-04', title:'UNARMED', image:'./images/tracks/06-unarmed/hero.png', meta:'ACT II / SURRENDER' },
  { code:'PR-05', title:'FAULT LINE', image:'./images/tracks/09-fault-line/hero.png', meta:'ACT IV / FRACTURE' },
  { code:'PR-06', title:'WHEN HALOS BURN', image:'./images/tracks/12-when-halos-burn/hero.png', meta:'ACT V / RELEASE' },
  { code:'PR-07', title:'AFTERLIGHT', image:'./images/tracks/13-afterlight/hero.png', meta:'EPILOGUE / MORNING' },
  { code:'PR-08', title:'HAN SEOJUN', image:'./images/archive/characters/han-seojun.png', meta:'CHARACTER CAMPAIGN / MEMORY' }
]

const trackPairs = [
  ['01B','FIRST CONTACT','01C','SECOND LOOK','ONE ENCOUNTER / TWO INTERPRETATIONS','Taeyun begins with a file. Jiwon begins with a contradiction. The same moment destabilizes certainty from opposite sides.'],
  ['02','NO SAINT','03','HOLD THE LINE','SELF-DEFINITION / RESISTANCE','Taeyun refuses innocence while Jiwon tries to preserve the category that makes him legible as a threat.'],
  ['07','OFF THE RECORD','08','OFF SCRIPT','PRIVATE SELF / PRIVATE LOVE','Jiwon discovers who he is outside Aegis. Taeyun discovers a relationship that no longer behaves like an operation.'],
  ['09','FAULT LINE','10','DON’T COME BACK','BETRAYAL / SEPARATION','The fracture is heard first through Jiwon’s loss of agency, then through Taeyun’s decision to stop choosing for him.'],
  ['01A','THE LINE','11','THE LINE — REPRISE','DOCTRINE / CHOICE','The opening defines the line as something Vesper imposes. The reprise asks what remains when Jiwon chooses where to stand.']
]

const motifs = [
  ['M-01','THE LINE','BOUNDARY → HORIZON','A political category, physical distance and romantic threshold. The story gradually turns a rule imposed by Vesper into something the characters can choose how to cross.'],
  ['M-02','STAY','PROTECTION → PRESENCE','Jiwon begins by protecting through action. “Stay” becomes the quieter version of that instinct: remaining without controlling the person beside him.'],
  ['M-03','TRUTH','EVIDENCE → ACCOUNTABILITY','Taeyun’s central value is also his contradiction. Truth matters only once he stops treating it as permission to decide for everyone else.'],
  ['M-04','HANDS / GLOVES','CONTROL → CARE','Gloves create professional distance. Bare hands recur when restraint, care, trust and consent become more important than role.'],
  ['M-05','NAMES','ROLE → PERSON','Aegis and Architect are public functions. “Jiwon” and “Taeyun” become increasingly important as both men resist being reduced to what their systems need them to represent.'],
  ['M-06','WEAPONS','ADVANTAGE → RESTRAINT','Power is shown most clearly through what someone chooses not to do with it. Several intimate beats begin when tactical advantage is deliberately left unused.'],
  ['M-07','PULSE / BREATH','THREAT → AWARENESS','Body signals initially belong to combat and danger. Proximity slowly makes the same language impossible to separate from attraction.'],
  ['M-08','DOORS / EXITS','ESCAPE → DECISION','Leaving is kept possible. The emotional meaning changes when either man could walk away and chooses not to.'],
  ['M-09','ORDINARY THINGS','MISSION → ROUTINE','Coffee, messages, sleep and familiar rooms let the relationship become real because they are too small to function as ideology.']
]

const storyNotes = [
  ['DN-01','HERO / VILLAIN IS A POINT OF VIEW','The project never needed HALO to be pure evil or Eclipse to be automatically righteous. The conflict works because both systems can describe a real danger while still reducing people to roles.'],
  ['DN-02','TAEYUN BEGINS WITH A PLAN','Jiwon is initially an access vector: profile, leverage and biometric route. Keeping that uncomfortable truth intact is what makes the eventual relationship require accountability instead of a convenient reveal that Taeyun was secretly innocent.'],
  ['DN-03','JIWON INITIATES THE FIRST KISS','Taeyun is usually the person engineering distance. In UNARMED he stops. Jiwon closing the final distance makes the moment explicitly his choice and marks the first time desire outranks procedure without erasing agency.'],
  ['DN-04','TAEYUN FALLS FIRST / JIWON SAYS IT FIRST','The emotional asymmetry matters. Taeyun recognizes love earlier but avoids naming it because truth would cost him control. Jiwon arrives later, harder, and ultimately says “I love you” first because clarity is part of his final choice.'],
  ['DN-05','SEOJUN MUST REMAIN A PERSON','Seojun cannot exist only to motivate Jiwon or redeem Taeyun. Public martyr, private witness and older brother are deliberately conflicting versions of one person whose life was flattened by the official story.'],
  ['DN-06','HALO HAS TO BE BEAUTIFUL','An obviously sinister regime would make Vesper too easy to read. HALO is clean, useful and aesthetically convincing because institutional control is more interesting when people have understandable reasons to trust it.']
]

const actOrder = ['OPENING','ACT I','ACT II','ACT III','ACT IV','ACT V','EPILOGUE']
const soundArc = ['ORDER','DISTURBANCE','INTIMACY','WARMTH','FRACTURE','REORDERING','MORNING']

const frameMarkup = (item, group) => `
  <button class="extras-frame" type="button" data-extra-image="${item.image}" data-extra-title="${item.title}" data-extra-meta="${item.role || item.meta}" data-extra-group="${group}">
    <span class="extras-frame__art"><img src="${item.image}" alt="" loading="lazy" decoding="async" /></span>
    <span class="extras-frame__shade" aria-hidden="true"></span>
    <span class="extras-frame__meta"><small>${item.code}</small><i>${item.role || item.meta}</i></span>
    <strong>${item.title}</strong>
    ${item.note ? `<p>${item.note}</p>` : ''}
    <span class="extras-frame__open">OPEN FRAME ↗</span>
  </button>`

const build = () => {
  if (!root) return
  root.innerHTML = `
    <header class="extras-topbar">
      <a class="extras-topbar__identity" href="./index.html" aria-label="WHEN HALOS BURN home"><span class="extras-topbar__mark"></span><span><b>A CINEMATIC</b><b>CONCEPT ALBUM</b></span></a>
      <nav class="extras-topbar__nav" aria-label="Primary navigation"><a href="./index.html">HOME</a><a href="./story.html#story-hub">STORY MODE</a><a href="./archive.html">ARCHIVE MODE</a><a href="./world.html">WORLD</a><a class="is-active" href="./extras.html">EXTRAS</a></nav>
      <div class="extras-topbar__edition"><span>PRODUCTION EDITION</span><span>01 / COMPLETE</span></div>
    </header>

    <section class="extras-hero" id="extras-top">
      <div class="extras-hero__art" aria-hidden="true"><img src="./images/tracks/12-when-halos-burn/hero.png" alt="" fetchpriority="high" /></div>
      <div class="extras-hero__shade" aria-hidden="true"></div><div class="extras-hero__grain" aria-hidden="true"></div>
      <div class="extras-hero__copy"><p>00 / BEYOND THE STORY</p><h1>EXTRAS</h1><strong>STEP OUTSIDE VESPER.<br />SEE HOW THE STORY WAS BUILT.</strong><a href="#concept-art">OPEN CONCEPT BOOK <i>↓</i></a></div>
      <div class="extras-hero__folio" aria-hidden="true"><span>VISUAL DEVELOPMENT</span><i></i><span>MUSIC / STORY / DESIGN</span></div>
    </section>

    <nav class="extras-index" aria-label="Extras sections"><span>CONCEPT BOOK</span><a href="#concept-art">01 / ART</a><a href="#music-lab">02 / MUSIC</a><a href="#motifs">03 / MOTIFS</a><a href="#behind-story">04 / STORY</a><a href="#bonus-media">05 / BONUS</a><a href="#credits">06 / CREDITS</a></nav>

    <main class="extras-content">
      <section class="extras-section extras-concept" id="concept-art">
        <header class="extras-section__head"><div><span>01 / VISUAL DEVELOPMENT</span><h2>CONCEPT<br />ART.</h2></div><p>Selected visual development from the finished project language: city, factions, characters and the institutional spaces that define Vesper.</p></header>
        <div class="extras-concept__grid">${conceptFrames.map((item) => frameMarkup(item,'VISUAL DEVELOPMENT')).join('')}</div>
      </section>

      <section class="extras-section extras-music" id="music-lab">
        <header class="extras-section__head"><div><span>02 / BUILDING THE SOUND</span><h2>MUSIC<br />LAB.</h2></div><p>The album is structured as dramatic perspective rather than a playlist. Songs answer, contradict and reframe one another as the relationship changes.</p></header>
        <div class="extras-sound-arc"><span>SOUND ARC</span>${soundArc.map((label,index) => `<div><small>${String(index+1).padStart(2,'0')}</small><strong>${label}</strong></div>`).join('')}</div>
        <div class="extras-act-grid">${actOrder.map((act,index) => { const meta=actMeta[act]; const count=chapterList.filter((chapter)=>chapter.act===act).length; return `<article><span>${String(index+1).padStart(2,'0')} / ${meta.label}</span><h3>${meta.title}</h3><p>${meta.description}</p><small>${count} CHAPTER${count===1?'':'S'}</small></article>` }).join('')}</div>
        <div class="extras-pairs"><div class="extras-pairs__head"><span>TRACK MIRRORS / DRAMATIC RESPONSES</span><strong>THE ALBUM TALKS TO ITSELF.</strong></div>${trackPairs.map(([a,at,b,bt,label,body]) => `<article><div><span>${a}</span><strong>${at}</strong></div><i>↔</i><div><span>${b}</span><strong>${bt}</strong></div><section><small>${label}</small><p>${body}</p></section></article>`).join('')}</div>
      </section>

      <section class="extras-section extras-motifs" id="motifs">
        <header class="extras-section__head"><div><span>03 / LANGUAGE BENEATH THE STORY</span><h2>MOTIFS &<br />SYMBOLISM.</h2></div><p>The Archive tracks recurring signals inside the fiction. Here, the same motifs are viewed from outside the story as deliberate narrative and visual design choices.</p></header>
        <div class="extras-motif-grid">${motifs.map(([code,title,shift,body]) => `<article><span>${code}</span><small>${shift}</small><h3>${title}</h3><p>${body}</p></article>`).join('')}</div>
      </section>

      <section class="extras-section extras-story" id="behind-story">
        <header class="extras-section__head"><div><span>04 / WRITING & DESIGN NOTES</span><h2>BEHIND<br />THE STORY.</h2></div><p>Creative decisions behind character agency, moral ambiguity and the visual logic of the project. This section discusses the full narrative.</p></header>
        <div class="extras-spoiler" data-spoiler-gate><span>SPOILER FIELD / COMPLETE STORY</span><h3>THE FOLLOWING NOTES DISCUSS MAJOR REVEALS.</h3><p>Includes Taeyun’s original plan, Seojun’s role, the first kiss, the final confession and the truth behind HALO.</p><button type="button" data-reveal-spoilers aria-expanded="false">REVEAL SPOILERS <i>↗</i></button></div>
        <div class="extras-story-notes" data-spoiler-content hidden>${storyNotes.map(([code,title,body]) => `<article><span>${code}</span><h3>${title}</h3><p>${body}</p></article>`).join('')}</div>
      </section>

      <section class="extras-section extras-bonus" id="bonus-media">
        <header class="extras-section__head"><div><span>05 / CAMPAIGN ARCHIVE</span><h2>PROMO &<br />BONUS MEDIA.</h2></div><p>A current campaign selection from the project artwork. This space is designed to expand later with alternate covers, posters, title treatments and wallpapers.</p></header>
        <div class="extras-bonus__grid">${bonusFrames.map((item) => frameMarkup(item,'CAMPAIGN FRAME')).join('')}</div>
      </section>

      <section class="extras-section extras-credits" id="credits">
        <header class="extras-section__head"><div><span>06 / PRODUCTION CREDITS</span><h2>THE PEOPLE<br />BEHIND VESPER.</h2></div><p>The production layer closes where the story began: with the choices that shaped the world, the music and the line between them.</p></header>
        <div class="extras-credits__hero"><span>CREATED BY</span><h3>RONNY</h3><p>WHEN HALOS BURN</p></div>
        <dl class="extras-credits__grid"><div><dt>CONCEPT / STORY</dt><dd>RONNY</dd></div><div><dt>CREATIVE DIRECTION</dt><dd>RONNY</dd></div><div><dt>FORMAT</dt><dd>CINEMATIC CONCEPT ALBUM / K-DRAMA-INSPIRED MUSICAL</dd></div><div><dt>INTERACTIVE EXPERIENCE</dt><dd>STORY / ARCHIVE / WORLD / EXTRAS</dd></div><div><dt>WEB BUILD</dt><dd>VITE / HTML / CSS / JAVASCRIPT</dd></div><div><dt>DEPLOYMENT</dt><dd>GITHUB PAGES</dd></div></dl>
        <div class="extras-credits__end"><span>WHB / PRODUCTION EDITION 01</span><strong>SOME LINES WERE NEVER MEANT TO STAY CLEAN.</strong><a href="./story.html#story-hub">RETURN TO STORY <i>→</i></a></div>
      </section>
    </main>

    <nav class="extras-mobile-dock" aria-label="Mobile navigation"><a href="./index.html"><i>⌂</i><span>HOME</span></a><a href="./story.html#story-hub"><i>▣</i><span>STORY</span></a><a href="./archive.html"><i>▤</i><span>ARCHIVE</span></a><a href="./world.html"><i>◎</i><span>WORLD</span></a><a class="is-active" href="./extras.html"><i>◇</i><span>EXTRAS</span></a></nav>

    <div class="extras-lightbox" data-extras-lightbox hidden role="dialog" aria-modal="true" aria-label="Artwork preview"><button type="button" data-lightbox-close aria-label="Close artwork">×</button><figure><img data-lightbox-image src="" alt="" /><figcaption><span data-lightbox-group></span><h3 data-lightbox-title></h3><p data-lightbox-meta></p></figcaption></figure></div>
  `
  bind()
}

const openLightbox = (button) => {
  const box = root.querySelector('[data-extras-lightbox]')
  if (!box) return
  const image = box.querySelector('[data-lightbox-image]')
  image.src = button.dataset.extraImage
  image.alt = button.dataset.extraTitle
  box.querySelector('[data-lightbox-title]').textContent = button.dataset.extraTitle
  box.querySelector('[data-lightbox-meta]').textContent = button.dataset.extraMeta
  box.querySelector('[data-lightbox-group]').textContent = button.dataset.extraGroup
  box.hidden = false
  document.body.classList.add('extras-lightbox-open')
  box.querySelector('[data-lightbox-close]')?.focus()
}

const closeLightbox = () => {
  const box = root.querySelector('[data-extras-lightbox]')
  if (!box || box.hidden) return
  box.hidden = true
  document.body.classList.remove('extras-lightbox-open')
}

const bind = () => {
  root.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'))
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth', block:'start' })
  }))

  root.querySelectorAll('[data-extra-image]').forEach((button) => button.addEventListener('click', () => openLightbox(button)))
  root.querySelector('[data-lightbox-close]')?.addEventListener('click', closeLightbox)
  root.querySelector('[data-extras-lightbox]')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeLightbox() })

  root.querySelector('[data-reveal-spoilers]')?.addEventListener('click', (event) => {
    const button = event.currentTarget
    const content = root.querySelector('[data-spoiler-content]')
    const gate = root.querySelector('[data-spoiler-gate]')
    if (!content) return
    const opening = content.hidden
    content.hidden = !opening
    button.setAttribute('aria-expanded', String(opening))
    button.innerHTML = opening ? 'HIDE SPOILERS <i>↑</i>' : 'REVEAL SPOILERS <i>↗</i>'
    gate?.classList.toggle('is-open', opening)
    if (opening) content.scrollIntoView({ behavior:'smooth', block:'nearest' })
  })

  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox() })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once:true })
else build()
