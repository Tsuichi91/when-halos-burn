import './styles/site.css'
import './styles/story-experience.css'
import './styles/story-world-assets.css'
import './styles/story-game-ui.css'
import './styles/story-game-refine.css'
import './styles/world-transition-motion.css'
import './styles/story-home-reference.css'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const progressBar = document.querySelector('.story-progress span')
const sceneNumber = document.querySelector('#scene-number')
const sceneLabel = document.querySelector('#scene-label')
const vesperScene = document.querySelector('#vesper')
const haloScene = document.querySelector('#halo')
const eclipseScene = document.querySelector('#eclipse')
const worldIntroScenes = [vesperScene, haloScene, eclipseScene].filter(Boolean)
const storyHub = document.querySelector('#story-hub')

const chapterLibrary = {
  '01A': { title: 'PROLOGUE: THE LINE', href: './chapter.html?chapter=01A' },
  '01B': { title: 'FIRST CONTACT', href: './chapter.html?chapter=01B' },
  '01C': { title: 'SECOND LOOK', href: './chapter.html?chapter=01C' }
}

const playableCodes = Object.keys(chapterLibrary)
const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'
const worldIntroStorageKey = 'whb-world-intro-seen-v1'
let openingProgress = null

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

const hasSeenWorldIntro = () => {
  try { return window.localStorage.getItem(worldIntroStorageKey) === '1' } catch { return false }
}

const rememberWorldIntro = () => {
  try { window.localStorage.setItem(worldIntroStorageKey, '1') } catch { /* storage optional */ }
}

const setWorldIntroHidden = (hidden) => {
  worldIntroScenes.forEach((scene) => {
    scene.hidden = hidden
    scene.setAttribute('aria-hidden', String(hidden))
  })
}

const buildStoryHome = () => {
  if (!storyHub) return

  storyHub.innerHTML = `
    <div class="story-home">
      <header class="story-home__topbar">
        <a class="story-home__identity" href="./index.html" aria-label="WHEN HALOS BURN home">
          <span class="story-home__halo-mark" aria-hidden="true"></span>
          <span class="story-home__identity-copy"><span>A CINEMATIC</span><span>CONCEPT ALBUM</span></span>
        </a>

        <nav class="story-home__nav" aria-label="Story Mode navigation">
          <a href="./index.html">HOME</a>
          <a class="is-active" href="#story-hub">STORY MODE</a>
          <a href="./archive.html">ARCHIVE MODE</a>
          <button type="button" data-replay-world-intro>WORLD</button>
          <button type="button" aria-disabled="true">EXTRAS</button>
        </nav>

        <div class="story-home__city" aria-label="Setting">
          <span>VESPER CITY<br />2164</span>
          <span class="story-home__menu-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        </div>
      </header>

      <section class="story-home__hero">
        <div class="story-home__hero-art" aria-hidden="true"><img src="./images/landing/vesper-city.png" alt="" /></div>
        <div class="story-home__hero-shade" aria-hidden="true"></div>
        <div class="story-home__hero-grid" aria-hidden="true"></div>

        <div class="story-home__hero-copy">
          <p class="story-home__eyebrow">STORY MODE</p>
          <h1>WHEN HALOS BURN</h1>
          <span class="story-home__tagline">SOME LINES WERE NEVER MEANT TO STAY CLEAN</span>
          <p class="story-home__intro">STEP INTO THE STORY.<br />EXPERIENCE THE ALBUM THROUGH SCENES, PERSPECTIVES AND CHOICES.</p>

          <button class="story-home__continue" type="button" data-continue-story>
            <span data-continue-label>CONTINUE</span><i>›</i>
          </button>
          <div class="story-home__continue-meta">
            <span data-continue-title>PROLOGUE: THE LINE</span>
            <span data-continue-status>NOT STARTED</span>
          </div>
        </div>

        <div class="story-home__hero-edge" aria-hidden="true"><span>DIFFERENT</span><span>PEOPLE</span><span>SAME</span><span>SKY</span></div>
      </section>

      <main class="story-home__main">
        <div class="story-home__chapters-head">
          <h2>CHAPTERS</h2>
          <span id="opening-progress">0 / 3 COMPLETE</span>
        </div>

        <div class="story-home__chapter-grid" aria-label="Story chapters">
          <article class="story-home-card story-home-card--01a" data-episode-card="01A">
            <img src="./images/landing/vesper-city.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">01</span>
              <div class="story-home-card__copy"><small>NARRATOR / OPENING</small><h3>PROLOGUE:<br />THE LINE</h3></div>
              <div class="story-home-card__footer"><span data-episode-status="01A">NOT STARTED</span><button type="button" data-open-chapter="01A"><span>DETAILS</span> ›</button></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--01b" data-episode-card="01B">
            <img src="./images/tracks/hero.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">02</span>
              <div class="story-home-card__copy"><small>TAEYUN POV / OPENING</small><h3>FIRST CONTACT</h3></div>
              <div class="story-home-card__footer"><span data-episode-status="01B">AVAILABLE</span><button type="button" data-open-chapter="01B"><span>DETAILS</span> ›</button></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--01c" data-episode-card="01C">
            <img src="./images/tracks/01c-second-look/hero.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">03</span>
              <div class="story-home-card__copy"><small>JIWON POV / OPENING</small><h3>SECOND LOOK</h3></div>
              <div class="story-home-card__footer"><span data-episode-status="01C">AVAILABLE</span><button type="button" data-open-chapter="01C"><span>DETAILS</span> ›</button></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--02 is-upcoming">
            <img src="./images/world/eclipse-headquarters.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">04</span>
              <div class="story-home-card__copy"><small>TAEYUN POV / ACT I</small><h3>NO SAINT</h3></div>
              <div class="story-home-card__footer"><span>UPCOMING</span><span>02</span></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--03 is-upcoming">
            <img src="./images/world/halo-headquarters.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">05</span>
              <div class="story-home-card__copy"><small>JIWON POV / ACT I</small><h3>HOLD THE LINE</h3></div>
              <div class="story-home-card__footer"><span>UPCOMING</span><span>03</span></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--04 is-upcoming">
            <img src="./images/landing/vesper-city.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">06</span>
              <div class="story-home-card__copy"><small>TAEYUN POV / ACT I</small><h3>CROSSFIRE</h3></div>
              <div class="story-home-card__footer"><span>UPCOMING</span><span>04</span></div>
            </div>
          </article>
        </div>

        <section class="story-home__perspective" aria-label="Story Mode description">
          <strong>YOUR STORY.<br />YOUR PERSPECTIVE.</strong><i aria-hidden="true"></i>
          <p>EXPLORE THE ALBUM THROUGH ITS CHARACTERS, LOCATIONS AND HIDDEN DETAILS AS THE STORY UNFOLDS. NOT EVERYTHING IS AS IT SEEMS.</p>
        </section>
      </main>

      <footer class="story-home__footer" aria-hidden="true">
        <div>CONTROL<br />OBSERVE<br />PROTECT</div>
        <div class="story-home__footer-center"><i></i>ENTER VESPER</div>
        <div>QUESTION<br />DISRUPT<br />RECLAIM</div>
      </footer>

      <nav class="story-home__mobile-dock" aria-label="Mobile navigation">
        <a href="./index.html"><i>⌂</i><span>HOME</span></a>
        <a class="is-active" href="#story-hub"><i>▣</i><span>STORY</span></a>
        <a href="./archive.html"><i>▤</i><span>ARCHIVE</span></a>
        <button type="button" data-replay-world-intro><i>◎</i><span>WORLD</span></button>
        <button type="button" aria-disabled="true"><i>◇</i><span>EXTRAS</span></button>
      </nav>
    </div>
  `

  openingProgress = storyHub.querySelector('#opening-progress')
}

buildStoryHome()

const scenes = [...document.querySelectorAll('[data-scene]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const artLayers = [...document.querySelectorAll('.scene-art img')]

const getContinueCode = () => {
  const inProgress = playableCodes.find((code) => started.has(code) && !completed.has(code))
  return inProgress || playableCodes.find((code) => !completed.has(code)) || '01A'
}

const updateProgress = () => {
  playableCodes.forEach((code, index) => {
    const card = storyHub?.querySelector(`[data-episode-card="${code}"]`)
    const status = storyHub?.querySelector(`[data-episode-status="${code}"]`)
    const isComplete = completed.has(code)
    const isStarted = started.has(code)
    card?.classList.toggle('is-complete', isComplete)
    if (status) status.textContent = isComplete ? 'COMPLETE' : isStarted ? 'IN PROGRESS' : index === 0 ? 'NOT STARTED' : 'AVAILABLE'
  })

  const completeCount = playableCodes.filter((code) => completed.has(code)).length
  if (openingProgress) openingProgress.textContent = `${completeCount} / 3 COMPLETE`

  const code = getContinueCode()
  const allComplete = completeCount === playableCodes.length
  const button = storyHub?.querySelector('[data-continue-story]')
  const label = storyHub?.querySelector('[data-continue-label]')
  const title = storyHub?.querySelector('[data-continue-title]')
  const status = storyHub?.querySelector('[data-continue-status]')
  if (button) button.dataset.continueCode = code
  if (label) label.textContent = allComplete ? 'REPLAY OPENING' : started.has(code) ? 'CONTINUE' : 'START'
  if (title) title.textContent = chapterLibrary[code].title
  if (status) status.textContent = allComplete ? 'OPENING COMPLETE' : started.has(code) ? 'IN PROGRESS' : 'NOT STARTED'
}

updateProgress()

const openChapter = (code) => {
  const target = chapterLibrary[code]
  if (target) window.location.href = target.href
}

storyHub?.querySelectorAll('[data-open-chapter]').forEach((button) => {
  button.addEventListener('click', () => openChapter(button.dataset.openChapter))
})

storyHub?.querySelector('[data-continue-story]')?.addEventListener('click', (event) => {
  openChapter(event.currentTarget.dataset.continueCode || getContinueCode())
})

const clamp01 = (value) => Math.min(Math.max(value, 0), 1)

const createWorldTransition = () => {
  const layer = document.createElement('div')
  layer.className = 'world-transition'
  layer.setAttribute('aria-hidden', 'true')
  layer.innerHTML = `
    <div class="world-transition__veil"></div>
    <div class="world-transition__axis"></div>
    <div class="world-transition__ring"><i></i></div>
    <div class="world-transition__scan"></div>
    <div class="world-transition__glitch"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="world-transition__label"><span data-world-transition="status"></span><strong data-world-transition="target"></strong></div>
  `
  document.body.appendChild(layer)
  return layer
}

const worldTransition = createWorldTransition()
const worldTransitionStatus = worldTransition.querySelector('[data-world-transition="status"]')
const worldTransitionTarget = worldTransition.querySelector('[data-world-transition="target"]')

const getWorldBoundaryProgress = (incomingScene) => {
  if (!incomingScene || incomingScene.hidden) return 0
  const rect = incomingScene.getBoundingClientRect()
  return clamp01((window.innerHeight * 1.05 - rect.top) / window.innerHeight)
}

const setWorldTransitionCopy = (mode, progress) => {
  if (!worldTransitionStatus || !worldTransitionTarget) return
  if (mode === 'halo') {
    worldTransitionStatus.textContent = progress < .52 ? 'CITY NETWORK // ROUTING' : 'HALO PROTOCOL // ACCESS GRANTED'
    worldTransitionTarget.textContent = progress < .52 ? 'ENTERING CONTROL GRID' : 'SYSTEM LOCKED'
  } else {
    worldTransitionStatus.textContent = progress < .52 ? 'HALO SECURE GRID // SIGNAL LOSS' : 'ECLIPSE CHANNEL // SIGNAL ACQUIRED'
    worldTransitionTarget.textContent = progress < .52 ? 'CONTROL SIGNAL FRACTURING' : 'ENTER SHADOW GRID'
  }
}

const updateWorldTransitions = () => {
  if (worldIntroScenes.every((scene) => scene.hidden)) {
    worldTransition.classList.remove('is-active')
    return
  }

  if (!vesperScene || !haloScene || !eclipseScene) return

  if (reducedMotion) {
    vesperScene.style.setProperty('--world-out','0')
    haloScene.style.setProperty('--world-in','1')
    haloScene.style.setProperty('--world-out','0')
    eclipseScene.style.setProperty('--world-in','1')
    worldTransition.classList.remove('is-active')
    return
  }

  const haloProgress = getWorldBoundaryProgress(haloScene)
  const eclipseProgress = getWorldBoundaryProgress(eclipseScene)
  vesperScene.style.setProperty('--world-out', haloProgress.toFixed(4))
  haloScene.style.setProperty('--world-in', haloProgress.toFixed(4))
  haloScene.style.setProperty('--world-out', eclipseProgress.toFixed(4))
  eclipseScene.style.setProperty('--world-in', eclipseProgress.toFixed(4))

  let mode = null
  let progress = 0
  if (haloProgress > 0 && haloProgress < 1) { mode = 'halo'; progress = haloProgress }
  else if (eclipseProgress > 0 && eclipseProgress < 1) { mode = 'eclipse'; progress = eclipseProgress }

  if (!mode) {
    worldTransition.classList.remove('is-active')
    worldTransition.style.setProperty('--wt-p','0')
    worldTransition.style.setProperty('--wt-wave','0')
    return
  }

  worldTransition.dataset.mode = mode
  worldTransition.style.setProperty('--wt-p', progress.toFixed(4))
  worldTransition.style.setProperty('--wt-wave', Math.sin(Math.PI * progress).toFixed(4))
  worldTransition.classList.add('is-active')
  setWorldTransitionCopy(mode, progress)
}

const createStoryBoot = () => {
  const boot = document.createElement('div')
  boot.className = 'campaign-boot'
  boot.setAttribute('aria-hidden','true')
  boot.innerHTML = `<div class="campaign-boot__inner"><span>STORY MODE // CAMPAIGN</span><strong>LOADING VESPER</strong><div class="campaign-boot__bar"><i></i></div><p>SYNCING WORLD / CHAPTER / ARCHIVE</p></div>`
  document.body.appendChild(boot)
  window.setTimeout(() => boot.classList.add('is-done'), reducedMotion ? 120 : 1450)
}

createStoryBoot()

const replayWorldIntro = () => {
  setWorldIntroHidden(false)
  document.body.classList.remove('is-story-home')
  history.replaceState(null,'','#vesper')
  requestAnimationFrame(() => {
    window.scrollTo({ top: vesperScene?.offsetTop || 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    requestScrollUpdate()
  })
}

storyHub?.querySelectorAll('[data-replay-world-intro]').forEach((button) => button.addEventListener('click', replayWorldIntro))

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible') })
}, { threshold:.22, rootMargin:'0px 0px -8% 0px' })
revealItems.forEach((item) => revealObserver.observe(item))

const hubSeenObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) rememberWorldIntro() })
}, { threshold:.18 })
if (storyHub) hubSeenObserver.observe(storyHub)

const updateActiveScene = () => {
  const visibleScenes = scenes.filter((scene) => !scene.hidden)
  if (!visibleScenes.length) return
  const anchor = window.innerHeight * .44
  let active = visibleScenes[0]
  let nearest = Number.POSITIVE_INFINITY

  visibleScenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect()
    if (rect.top <= anchor && rect.bottom >= anchor) { active = scene; nearest = 0; return }
    if (nearest === 0) return
    const distance = Math.min(Math.abs(rect.top - anchor),Math.abs(rect.bottom - anchor))
    if (distance < nearest) { nearest = distance; active = scene }
  })

  if (sceneNumber) sceneNumber.textContent = active.dataset.scene
  if (sceneLabel) sceneLabel.textContent = active.dataset.label
  document.body.classList.toggle('is-story-home', active === storyHub)
}

let ticking = false
const updateScrollEffects = () => {
  ticking = false
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  progressBar?.style.setProperty('transform',`scaleX(${clamp01(progress)})`)
  updateActiveScene()
  updateWorldTransitions()

  if (reducedMotion) return
  artLayers.forEach((img) => {
    const section = img.closest('[data-scene]')
    if (!section || section.hidden) return
    const rect = section.getBoundingClientRect()
    const p = clamp01((window.innerHeight - rect.top) / (window.innerHeight + rect.height))
    img.style.translate = `0 ${(p - .5) * 18}px`
  })
}

function requestScrollUpdate() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateScrollEffects)
}

window.addEventListener('scroll',requestScrollUpdate,{ passive:true })
window.addEventListener('resize',requestScrollUpdate)

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const vesperArt = vesperScene?.querySelector('.scene-art img')
  vesperScene?.addEventListener('pointermove',(event) => {
    if (!vesperArt) return
    const x = event.clientX / window.innerWidth - .5
    const y = event.clientY / window.innerHeight - .5
    vesperArt.style.transform = `scale(1.055) translate(${x * -6}px,${y * -3}px)`
  })
  vesperScene?.addEventListener('pointerleave',() => { if (vesperArt) vesperArt.style.transform = 'scale(1.04)' })
}

const forceWorld = window.location.hash === '#vesper'
const forceHub = window.location.hash === '#story-hub'

if (forceWorld) {
  setWorldIntroHidden(false)
  window.setTimeout(() => {
    window.scrollTo({ top:vesperScene?.offsetTop || 0, behavior:'auto' })
    requestScrollUpdate()
  }, reducedMotion ? 40 : 1500)
} else if (forceHub || hasSeenWorldIntro()) {
  setWorldIntroHidden(true)
  window.setTimeout(() => {
    window.scrollTo({ top:storyHub?.offsetTop || 0, behavior:'auto' })
    requestScrollUpdate()
  }, reducedMotion ? 40 : 1500)
} else {
  requestScrollUpdate()
}
