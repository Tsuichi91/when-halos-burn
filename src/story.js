import './styles/site.css'
import './styles/story-experience.css'
import './styles/story-world-assets.css'
import './styles/first-contact.css'
import './styles/audio-player.css'
import './styles/story-game-ui.css'
import './styles/story-game-refine.css'
import './styles/story-rebuild.css'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const progressBar = document.querySelector('.story-progress span')
const sceneNumber = document.querySelector('#scene-number')
const sceneLabel = document.querySelector('#scene-label')
const scenes = [...document.querySelectorAll('[data-scene]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const artLayers = [...document.querySelectorAll('.scene-art img, .game-track__art img')]

const trackLibrary = {
  '01A': { title: 'PROLOGUE: THE LINE', src: './audio/tracks/01a-prologue-the-line.mp3' },
  '01B': { title: 'FIRST CONTACT', src: './audio/tracks/01b-first-contact.mp3' },
  '01C': { title: 'SECOND LOOK', src: './audio/tracks/01c-second-look.mp3' }
}

const activeAudioPlayers = []

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

    const syncDuration = () => {
      duration.textContent = formatTime(audio.duration)
    }

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

    audio.addEventListener('loadedmetadata', () => {
      syncDuration()
      syncProgress()
    })
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

createStoryBoot()
initAudioPlayers()

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible')
  })
}, {
  threshold: 0.22,
  rootMargin: '0px 0px -8% 0px'
})

revealItems.forEach((item) => revealObserver.observe(item))

const beatObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('is-current', entry.isIntersecting)
  })
}, {
  threshold: 0.56,
  rootMargin: '-12% 0px -12% 0px'
})

document.querySelectorAll('.game-track__beat').forEach((beat) => beatObserver.observe(beat))

const updateActiveScene = () => {
  if (!scenes.length) return

  const anchor = window.innerHeight * 0.44
  let active = scenes[0]
  let nearestDistance = Number.POSITIVE_INFINITY

  scenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect()

    if (rect.top <= anchor && rect.bottom >= anchor) {
      active = scene
      nearestDistance = 0
      return
    }

    if (nearestDistance === 0) return

    const distance = Math.min(
      Math.abs(rect.top - anchor),
      Math.abs(rect.bottom - anchor)
    )

    if (distance < nearestDistance) {
      nearestDistance = distance
      active = scene
    }
  })

  const { scene, label } = active.dataset
  if (sceneNumber) sceneNumber.textContent = scene
  if (sceneLabel) sceneLabel.textContent = label
}

let ticking = false

const updateScrollEffects = () => {
  ticking = false

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  progressBar?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`)

  updateActiveScene()

  if (reducedMotion) return

  artLayers.forEach((img) => {
    const section = img.closest('[data-scene]')
    if (!section) return

    const rect = section.getBoundingClientRect()
    const sectionProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
    const clamped = Math.min(Math.max(sectionProgress, 0), 1)
    const drift = (clamped - 0.5) * 18
    img.style.translate = `0 ${drift}px`
  })
}

const requestScrollUpdate = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateScrollEffects)
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true })
window.addEventListener('resize', requestScrollUpdate)
requestScrollUpdate()

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const vesper = document.querySelector('.story-scene--vesper')
  const vesperArt = vesper?.querySelector('.scene-art img')

  vesper?.addEventListener('pointermove', (event) => {
    if (!vesperArt) return
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5
    vesperArt.style.transform = `scale(1.055) translate(${x * -6}px, ${y * -3}px)`
  })

  vesper?.addEventListener('pointerleave', () => {
    if (vesperArt) vesperArt.style.transform = 'scale(1.04)'
  })
}
