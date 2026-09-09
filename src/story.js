import './styles/site.css'
import './styles/story-experience.css'
import './styles/story-world-assets.css'
import './styles/first-contact.css'
import './styles/audio-player.css'
import './styles/story-game-ui.css'
import './styles/story-game-refine.css'
import './styles/story-rebuild.css'
import './styles/world-transition-motion.css'
import './styles/story-hub.css'
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
const episodeExperiences = [...document.querySelectorAll('.episode-experience[data-episode]')]

const trackLibrary = {
  '01A': { title: 'PROLOGUE: THE LINE', src: './audio/tracks/01a-prologue-the-line.mp3' },
  '01B': { title: 'FIRST CONTACT', src: './audio/tracks/01b-first-contact.mp3' },
  '01C': { title: 'SECOND LOOK', src: './audio/tracks/01c-second-look.mp3' }
}

const playableCodes = Object.keys(trackLibrary)
const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'
const worldIntroStorageKey = 'whb-world-intro-seen-v1'
const activeAudioPlayers = []
let activeEpisodeCode = null
let openingProgress = null

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
        <div class="story-home__hero-art" aria-hidden="true">
          <img src="./images/landing/vesper-city.png" alt="" />
        </div>
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

        <div class="story-home__hero-edge" aria-hidden="true">
          <span>DIFFERENT</span><span>PEOPLE</span><span>SAME</span><span>SKY</span>
        </div>
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
              <div class="story-home-card__copy">
                <small>NARRATOR / OPENING</small>
                <h3>PROLOGUE:<br />THE LINE</h3>
              </div>
              <div class="story-home-card__footer">
                <span data-episode-status="01A">NEW</span>
                <button type="button" data-open-episode="01A"><span>VIEW</span> ›</button>
              </div>
            </div>
          </article>

          <article class="story-home-card story-home-card--01b" data-episode-card="01B">
            <img src="./images/tracks/hero.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">02</span>
              <div class="story-home-card__copy">
                <small>TAEYUN POV / OPENING</small>
                <h3>FIRST CONTACT</h3>
              </div>
              <div class="story-home-card__footer">
                <span data-episode-status="01B">AVAILABLE</span>
                <button type="button" data-open-episode="01B"><span>VIEW</span> ›</button>
              </div>
            </div>
          </article>

          <article class="story-home-card story-home-card--01c" data-episode-card="01C">
            <img src="./images/tracks/01c-second-look/hero.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">03</span>
              <div class="story-home-card__copy">
                <small>JIWON POV / OPENING</small>
                <h3>SECOND LOOK</h3>
              </div>
              <div class="story-home-card__footer">
                <span data-episode-status="01C">AVAILABLE</span>
                <button type="button" data-open-episode="01C"><span>VIEW</span> ›</button>
              </div>
            </div>
          </article>

          <article class="story-home-card story-home-card--02 is-upcoming">
            <img src="./images/world/eclipse-headquarters.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">04</span>
              <div class="story-home-card__copy">
                <small>TAEYUN POV / ACT I</small>
                <h3>NO SAINT</h3>
              </div>
              <div class="story-home-card__footer"><span>UPCOMING</span><span>02</span></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--03 is-upcoming">
            <img src="./images/world/halo-headquarters.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">05</span>
              <div class="story-home-card__copy">
                <small>JIWON POV / ACT I</small>
                <h3>HOLD THE LINE</h3>
              </div>
              <div class="story-home-card__footer"><span>UPCOMING</span><span>03</span></div>
            </div>
          </article>

          <article class="story-home-card story-home-card--04 is-upcoming">
            <img src="./images/landing/vesper-city.png" alt="" aria-hidden="true" />
            <div class="story-home-card__wash" aria-hidden="true"></div>
            <div class="story-home-card__inner">
              <span class="story-home-card__number">06</span>
              <div class="story-home-card__copy">
                <small>TAEYUN POV / ACT II</small>
                <h3>CROSSFIRE</h3>
              </div>
              <div class="story-home-card__footer"><span>UPCOMING</span><span>04</span></div>
            </div>
          </article>
        </div>

        <section class="story-home__perspective" aria-label="Story Mode description">
          <strong>YOUR STORY.<br />YOUR PERSPECTIVE.</strong>
          <i aria-hidden="true"></i>
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
const artLayers = [...document.querySelectorAll('.scene-art img, .game-track__art img')]

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

const setSeekVisual = (seek, value) => {
  const clamped = Math.min(Math.max(value, 0), 1000)
  seek.value = String(clamped)
  seek.style.setProperty('--audio-progress', `${clamped / 10}%`)
}

const initAudioPlayers = () => {
  document.querySelectorAll('.track-console').forEach((consoleEl) => {
    const code = consoleEl.querySelector('.track-console__meta span')?.textContent?.trim().toUpperCase()
    const track = code ? trackLibrary[code] : null
    const player = consoleEl.querySelector('.track-console__player')
    if (!track || !player) return

    player.setAttribute('aria-label', `${track.title} audio player`)
    player.innerHTML = `
      <button class="track-console__play" type="button" aria-label="Play ${track.title}">▶</button>
      <div class="track-console__transport">
        <input class="track-console__seek" type="range" min="0" max="1000" value="0" step="1" aria-label="Seek through ${track.title}" />
        <div class="track-console__times" aria-live="off">
          <span class="track-console__current">0:00</span>
          <span class="track-console__duration">--:--</span>
        </div>
      </div>
      <span class="track-console__state">MASTER / READY</span>
      <audio class="track-console__audio" preload="metadata" src="${track.src}"></audio>
    `

    const audio = player.querySelector('.track-console__audio')
    const playButton = player.querySelector('.track-console__play')
    const seek = player.querySelector('.track-console__seek')
    const currentTime = player.querySelector('.track-console__current')
    const duration = player.querySelector('.track-console__duration')
    const state = player.querySelector('.track-console__state')
    const note = consoleEl.querySelector(':scope > p')
    if (!audio || !playButton || !seek || !currentTime || !duration || !state) return

    consoleEl.classList.add('is-audio-ready')
    if (note) note.textContent = `${track.title} / FINAL MASTER — Story Mode audio.`

    const syncDuration = () => { duration.textContent = formatTime(audio.duration) }
    const syncProgress = () => {
      const progress = audio.duration > 0 ? (audio.currentTime / audio.duration) * 1000 : 0
      setSeekVisual(seek, progress)
      currentTime.textContent = formatTime(audio.currentTime)
    }
    const setPlayingState = (isPlaying) => {
      consoleEl.classList.toggle('is-playing', isPlaying)
      playButton.textContent = isPlaying ? 'Ⅱ' : '▶'
      playButton.setAttribute('aria-label', `${isPlaying ? 'Pause' : 'Play'} ${track.title}`)
      state.textContent = isPlaying ? 'MASTER / PLAYING' : 'MASTER / READY'
    }

    playButton.addEventListener('click', async () => {
      if (!audio.paused) {
        audio.pause()
        return
      }
      activeAudioPlayers.forEach((entry) => {
        if (entry.audio !== audio && !entry.audio.paused) entry.audio.pause()
      })
      try {
        await audio.play()
      } catch (error) {
        consoleEl.classList.add('is-audio-error')
        state.textContent = 'AUDIO / UNAVAILABLE'
        playButton.disabled = true
        console.error(`Could not play ${track.title}`, error)
      }
    })

    seek.addEventListener('input', () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return
      audio.currentTime = (Number(seek.value) / 1000) * audio.duration
      syncProgress()
    })

    audio.addEventListener('loadedmetadata', () => { syncDuration(); syncProgress() })
    audio.addEventListener('durationchange', syncDuration)
    audio.addEventListener('timeupdate', syncProgress)
    audio.addEventListener('play', () => setPlayingState(true))
    audio.addEventListener('pause', () => setPlayingState(false))
    audio.addEventListener('ended', () => {
      audio.currentTime = 0
      setSeekVisual(seek, 0)
      currentTime.textContent = '0:00'
      setPlayingState(false)
    })
    audio.addEventListener('error', () => {
      consoleEl.classList.add('is-audio-error')
      state.textContent = 'AUDIO / UNAVAILABLE'
      playButton.disabled = true
    })

    activeAudioPlayers.push({ audio, consoleEl })
  })
}

const pauseAllAudio = () => {
  activeAudioPlayers.forEach(({ audio }) => {
    if (!audio.paused) audio.pause()
  })
}

const readStoredEpisodes = (key) => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(stored) ? stored : [])
  } catch {
    return new Set()
  }
}

const completedEpisodes = readStoredEpisodes(completionStorageKey)
const startedEpisodes = readStoredEpisodes(startedStorageKey)

const saveStartedEpisodes = () => {
  try {
    window.localStorage.setItem(startedStorageKey, JSON.stringify([...startedEpisodes]))
  } catch {
    // The site remains usable when storage is unavailable.
  }
}

const markEpisodeStarted = (code) => {
  if (!trackLibrary[code] || completedEpisodes.has(code) || startedEpisodes.has(code)) return
  startedEpisodes.add(code)
  saveStartedEpisodes()
}

const hasSeenWorldIntro = () => {
  try {
    return window.localStorage.getItem(worldIntroStorageKey) === '1'
  } catch {
    return false
  }
}

const rememberWorldIntro = () => {
  try {
    window.localStorage.setItem(worldIntroStorageKey, '1')
  } catch {
    // The site remains usable when storage is unavailable.
  }
}

const setWorldIntroHidden = (hidden) => {
  worldIntroScenes.forEach((scene) => {
    scene.hidden = hidden
    scene.setAttribute('aria-hidden', String(hidden))
  })
}

const getContinueCode = () => {
  const inProgress = playableCodes.find((code) => startedEpisodes.has(code) && !completedEpisodes.has(code))
  return inProgress || playableCodes.find((code) => !completedEpisodes.has(code)) || '01A'
}

const updateContinueAction = () => {
  if (!storyHub) return
  const continueButton = storyHub.querySelector('[data-continue-story]')
  const continueLabel = storyHub.querySelector('[data-continue-label]')
  const continueTitle = storyHub.querySelector('[data-continue-title]')
  const continueStatus = storyHub.querySelector('[data-continue-status]')
  const allComplete = playableCodes.every((code) => completedEpisodes.has(code))
  const code = getContinueCode()

  if (continueButton) continueButton.dataset.continueCode = code
  if (continueLabel) continueLabel.textContent = allComplete ? 'REPLAY OPENING' : 'CONTINUE'
  if (continueTitle) continueTitle.textContent = trackLibrary[code]?.title || 'PROLOGUE: THE LINE'
  if (continueStatus) {
    continueStatus.textContent = allComplete
      ? 'OPENING COMPLETE'
      : startedEpisodes.has(code)
        ? 'IN PROGRESS'
        : 'NOT STARTED'
  }
}

const updateEpisodeProgress = () => {
  playableCodes.forEach((code, index) => {
    const card = document.querySelector(`[data-episode-card="${code}"]`)
    const status = document.querySelector(`[data-episode-status="${code}"]`)
    const buttonLabel = card?.querySelector('[data-open-episode] span')
    const complete = completedEpisodes.has(code)
    const inProgress = startedEpisodes.has(code) && !complete

    card?.classList.toggle('is-complete', complete)
    card?.classList.toggle('is-in-progress', inProgress)
    if (status) status.textContent = complete ? 'COMPLETE' : inProgress ? 'IN PROGRESS' : index === 0 ? 'NOT STARTED' : 'AVAILABLE'
    if (buttonLabel) buttonLabel.textContent = 'VIEW'
  })

  const totalComplete = playableCodes.filter((code) => completedEpisodes.has(code)).length
  if (openingProgress) openingProgress.textContent = `${totalComplete} / 3 COMPLETE`
  updateContinueAction()
}

const markEpisodeComplete = (code) => {
  if (!trackLibrary[code] || completedEpisodes.has(code)) return
  completedEpisodes.add(code)
  startedEpisodes.delete(code)
  try {
    window.localStorage.setItem(completionStorageKey, JSON.stringify([...completedEpisodes]))
    window.localStorage.setItem(startedStorageKey, JSON.stringify([...startedEpisodes]))
  } catch {
    // The experience still works when local storage is unavailable.
  }
  updateEpisodeProgress()
}

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
    <div class="world-transition__label">
      <span data-world-transition="status"></span>
      <strong data-world-transition="target"></strong>
    </div>
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
  const start = window.innerHeight * 1.05
  const distance = window.innerHeight
  return clamp01((start - rect.top) / distance)
}

const setWorldTransitionCopy = (mode, progress) => {
  if (!worldTransitionStatus || !worldTransitionTarget) return

  if (mode === 'halo') {
    worldTransitionStatus.textContent = progress < .52 ? 'CITY NETWORK // ROUTING' : 'HALO PROTOCOL // ACCESS GRANTED'
    worldTransitionTarget.textContent = progress < .52 ? 'ENTERING CONTROL GRID' : 'SYSTEM LOCKED'
    return
  }

  worldTransitionStatus.textContent = progress < .52 ? 'HALO SECURE GRID // SIGNAL LOSS' : 'ECLIPSE CHANNEL // SIGNAL ACQUIRED'
  worldTransitionTarget.textContent = progress < .52 ? 'CONTROL SIGNAL FRACTURING' : 'ENTER SHADOW GRID'
}

const updateWorldTransitions = () => {
  if (activeEpisodeCode || worldIntroScenes.every((scene) => scene.hidden)) {
    worldTransition.classList.remove('is-active')
    return
  }

  if (!vesperScene || !haloScene || !eclipseScene) return

  if (reducedMotion) {
    vesperScene.style.setProperty('--world-out', '0')
    haloScene.style.setProperty('--world-in', '1')
    haloScene.style.setProperty('--world-out', '0')
    eclipseScene.style.setProperty('--world-in', '1')
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

  if (haloProgress > 0 && haloProgress < 1) {
    mode = 'halo'
    progress = haloProgress
  } else if (eclipseProgress > 0 && eclipseProgress < 1) {
    mode = 'eclipse'
    progress = eclipseProgress
  }

  if (!mode) {
    worldTransition.classList.remove('is-active')
    worldTransition.style.setProperty('--wt-p', '0')
    worldTransition.style.setProperty('--wt-wave', '0')
    return
  }

  const wave = Math.sin(Math.PI * progress)
  worldTransition.dataset.mode = mode
  worldTransition.style.setProperty('--wt-p', progress.toFixed(4))
  worldTransition.style.setProperty('--wt-wave', wave.toFixed(4))
  worldTransition.classList.add('is-active')
  setWorldTransitionCopy(mode, progress)
}

const createStoryBoot = () => {
  const boot = document.createElement('div')
  boot.className = 'campaign-boot'
  boot.setAttribute('aria-hidden', 'true')
  boot.innerHTML = `
    <div class="campaign-boot__inner">
      <span>STORY MODE // CAMPAIGN</span>
      <strong>LOADING VESPER</strong>
      <div class="campaign-boot__bar"><i></i></div>
      <p>SYNCING WORLD / TRACK / POV / LOCATION</p>
    </div>
  `
  document.body.appendChild(boot)
  window.setTimeout(() => boot.classList.add('is-done'), reducedMotion ? 120 : 1450)
}

const setEpisodeChrome = (code) => {
  const track = trackLibrary[code]
  if (sceneNumber) sceneNumber.textContent = code || 'HUB'
  if (sceneLabel) sceneLabel.textContent = track?.title || 'STORY MODE'
}

const openEpisode = (code, updateHash = true) => {
  const target = document.querySelector(`.episode-experience[data-episode="${code}"]`)
  if (!target || !trackLibrary[code]) return

  markEpisodeStarted(code)
  pauseAllAudio()
  activeEpisodeCode = code
  setWorldIntroHidden(true)

  episodeExperiences.forEach((episode) => {
    const active = episode === target
    episode.hidden = !active
    episode.setAttribute('aria-hidden', String(!active))
  })

  if (storyHub) {
    storyHub.hidden = true
    storyHub.setAttribute('aria-hidden', 'true')
  }

  document.body.classList.add('is-episode-mode')
  document.body.classList.remove('is-story-home')
  setEpisodeChrome(code)
  worldTransition.classList.remove('is-active')

  if (updateHash) history.replaceState(null, '', `#episode-${code.toLowerCase()}`)

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    requestScrollUpdate()
  })
}

const closeEpisode = (updateHash = true) => {
  pauseAllAudio()
  activeEpisodeCode = null
  document.body.classList.remove('is-episode-mode')

  episodeExperiences.forEach((episode) => {
    episode.hidden = true
    episode.setAttribute('aria-hidden', 'true')
  })

  if (storyHub) {
    storyHub.hidden = false
    storyHub.setAttribute('aria-hidden', 'false')
  }

  setWorldIntroHidden(hasSeenWorldIntro())
  updateEpisodeProgress()

  if (updateHash) history.replaceState(null, '', '#story-hub')

  requestAnimationFrame(() => {
    const hubTop = storyHub?.offsetTop || 0
    window.scrollTo({ top: hubTop, behavior: reducedMotion ? 'auto' : 'smooth' })
    requestScrollUpdate()
  })
}

const replayWorldIntro = () => {
  if (activeEpisodeCode) closeEpisode(false)
  setWorldIntroHidden(false)
  document.body.classList.remove('is-story-home')
  history.replaceState(null, '', '#vesper')
  requestAnimationFrame(() => {
    window.scrollTo({ top: vesperScene?.offsetTop || 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    requestScrollUpdate()
  })
}

createStoryBoot()
initAudioPlayers()
updateEpisodeProgress()

if (hasSeenWorldIntro()) setWorldIntroHidden(true)

document.querySelectorAll('[data-open-episode]').forEach((button) => {
  button.addEventListener('click', () => {
    const code = button.dataset.openEpisode
    window.location.href = `./chapter.html?chapter=${encodeURIComponent(code)}`
  })
})

document.querySelectorAll('[data-close-episode]').forEach((button) => {
  button.addEventListener('click', () => closeEpisode())
})

document.querySelectorAll('[data-next-episode]').forEach((button) => {
  button.addEventListener('click', () => {
    if (activeEpisodeCode) markEpisodeComplete(activeEpisodeCode)
    openEpisode(button.dataset.nextEpisode)
  })
})

document.querySelectorAll('[data-replay-world-intro]').forEach((button) => {
  button.addEventListener('click', replayWorldIntro)
})

storyHub?.querySelector('[data-continue-story]')?.addEventListener('click', (event) => {
  const code = event.currentTarget.dataset.continueCode || getContinueCode()
  window.location.href = `./chapter.html?chapter=${encodeURIComponent(code)}`
})

const completionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) markEpisodeComplete(entry.target.dataset.completesEpisode)
  })
}, { threshold: 0.46 })

document.querySelectorAll('[data-completes-episode]').forEach((ending) => completionObserver.observe(ending))

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible')
  })
}, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' })

revealItems.forEach((item) => revealObserver.observe(item))

const beatObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-current', entry.isIntersecting)
  })
}, { threshold: 0.56, rootMargin: '-12% 0px -12% 0px' })

document.querySelectorAll('.game-track__beat').forEach((beat) => beatObserver.observe(beat))

const hubSeenObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !activeEpisodeCode) rememberWorldIntro()
  })
}, { threshold: 0.18 })

if (storyHub) hubSeenObserver.observe(storyHub)

const updateActiveScene = () => {
  if (activeEpisodeCode) {
    document.body.classList.remove('is-story-home')
    setEpisodeChrome(activeEpisodeCode)
    return
  }

  if (!scenes.length) return

  const anchor = window.innerHeight * 0.44
  let active = scenes.find((scene) => !scene.hidden) || scenes[0]
  let nearestDistance = Number.POSITIVE_INFINITY

  scenes.forEach((scene) => {
    if (scene.hidden) return
    const rect = scene.getBoundingClientRect()

    if (rect.top <= anchor && rect.bottom >= anchor) {
      active = scene
      nearestDistance = 0
      return
    }

    if (nearestDistance === 0) return
    const distance = Math.min(Math.abs(rect.top - anchor), Math.abs(rect.bottom - anchor))
    if (distance < nearestDistance) {
      nearestDistance = distance
      active = scene
    }
  })

  const { scene, label } = active.dataset
  if (sceneNumber) sceneNumber.textContent = scene
  if (sceneLabel) sceneLabel.textContent = label
  document.body.classList.toggle('is-story-home', active === storyHub)
}

let ticking = false

const updateScrollEffects = () => {
  ticking = false
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  progressBar?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`)

  updateActiveScene()
  updateWorldTransitions()

  if (reducedMotion) return

  artLayers.forEach((img) => {
    const section = img.closest('[data-scene], .episode-experience')
    if (!section || section.hidden) return
    const rect = section.getBoundingClientRect()
    const sectionProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
    const clamped = Math.min(Math.max(sectionProgress, 0), 1)
    img.style.translate = `0 ${(clamped - 0.5) * 18}px`
  })
}

function requestScrollUpdate() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateScrollEffects)
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true })
window.addEventListener('resize', requestScrollUpdate)

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const vesperArt = vesperScene?.querySelector('.scene-art img')
  vesperScene?.addEventListener('pointermove', (event) => {
    if (!vesperArt) return
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    vesperArt.style.transform = `scale(1.055) translate(${x * -6}px, ${y * -3}px)`
  })
  vesperScene?.addEventListener('pointerleave', () => {
    if (vesperArt) vesperArt.style.transform = 'scale(1.04)'
  })
}

const initialEpisode = window.location.hash.match(/^#episode-(01a|01b|01c)$/i)?.[1]?.toUpperCase()
if (initialEpisode) {
  window.setTimeout(() => openEpisode(initialEpisode, false), reducedMotion ? 160 : 1550)
} else {
  if (hasSeenWorldIntro() && storyHub) {
    window.setTimeout(() => {
      window.scrollTo({ top: storyHub.offsetTop || 0, behavior: 'auto' })
      requestScrollUpdate()
    }, reducedMotion ? 40 : 1500)
  } else {
    requestScrollUpdate()
  }
}
