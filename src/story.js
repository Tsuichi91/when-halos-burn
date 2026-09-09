import './styles/site.css'
import './styles/story-experience.css'
import './styles/story-world-assets.css'
import './styles/first-contact.css'
import './styles/prologue-player.css'
import './styles/track-handoff.css'
import './styles/second-look.css'
import './styles/second-look-ending.css'
import './styles/audio-player.css'
import './styles/story-game-ui.css'
import './styles/story-game-refine.css'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const progressBar = document.querySelector('.story-progress span')
const sceneNumber = document.querySelector('#scene-number')
const sceneLabel = document.querySelector('#scene-label')
const scenes = [...document.querySelectorAll('[data-scene]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const artLayers = [...document.querySelectorAll('.scene-art img, .first-contact__art img, .second-look__art img')]
const firstContact = document.querySelector('.first-contact')
const secondLook = document.querySelector('.second-look')

const campaignData = {
  vesper: { act: 'SYSTEM', track: '00', pov: '—', location: 'VESPER CITY', state: 'ENTRY', faction: 'neutral', signal: 'CITY NETWORK / ONLINE' },
  halo: { act: 'WORLD', track: '01', pov: '—', location: 'HALO HQ', state: 'CONTROL', faction: 'halo', signal: 'HALO PROTOCOL / ACTIVE' },
  eclipse: { act: 'WORLD', track: '02', pov: '—', location: 'SHADOW GRID', state: 'RESISTANCE', faction: 'eclipse', signal: 'ECLIPSE CHANNEL / OPEN' },
  opening: { act: 'OPENING', track: '—', pov: 'NARRATOR', location: 'VESPER CITY', state: 'CLASSIFICATION', faction: 'neutral', signal: 'STORY THREAD / INITIALIZED' },
  prologue: { act: 'OPENING', track: '01A', pov: 'NARRATOR', location: 'VESPER CITY', state: 'THE LINE', faction: 'neutral', signal: 'AUDIO MASTER / READY' },
  'first-contact': { act: 'OPENING', track: '01B', pov: 'TAEYUN', location: 'BORDER DISTRICT', state: 'RECOGNITION', faction: 'eclipse', signal: 'CONTACT EVENT / ACTIVE' },
  'second-look': { act: 'OPENING', track: '01C', pov: 'JIWON', location: 'HALO REVIEW', state: 'ANALYSIS', faction: 'halo', signal: 'REVIEW LOOP / ACTIVE' },
  'opening-end': { act: 'OPENING', track: '01C', pov: 'JIWON', location: 'HALO REVIEW', state: 'QUESTION', faction: 'halo', signal: 'OPENING / COMPLETE' },
  'act-one': { act: 'ACT I', track: '—', pov: '—', location: 'VESPER', state: 'ENEMIES', faction: 'neutral', signal: 'CHAPTER / UNLOCKED' },
  'no-saint-tease': { act: 'ACT I', track: '02', pov: 'TAEYUN', location: 'ECLIPSE', state: 'TRUTH', faction: 'eclipse', signal: 'NEXT TRACK / LOCKED IN' }
}

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
    if (note) note.textContent = `${track.title} / FINAL MASTER — listen within the Story Mode campaign.`

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
      if (!audio.paused) { audio.pause(); return }
      activeAudioPlayers.forEach((entry) => {
        if (entry.audio !== audio && !entry.audio.paused) entry.audio.pause()
      })
      try { await audio.play() }
      catch (error) {
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

const createCampaignInterface = () => {
  const hud = document.createElement('div')
  hud.className = 'campaign-hud'
  hud.setAttribute('aria-hidden', 'true')
  hud.innerHTML = `
    <div class="campaign-hud__left">
      <div class="campaign-hud__cell"><span>ACT</span><strong data-campaign="act">SYSTEM</strong></div>
      <div class="campaign-hud__cell"><span>TRACK</span><strong data-campaign="track">00</strong></div>
    </div>
    <div class="campaign-hud__center">
      <div class="campaign-hud__reticle"><i></i></div>
      <span class="campaign-hud__signal" data-campaign="signal">CITY NETWORK / ONLINE</span>
    </div>
    <div class="campaign-hud__right">
      <div class="campaign-hud__cell"><span>POV</span><strong data-campaign="pov">—</strong></div>
      <div class="campaign-hud__cell"><span>LOCATION</span><strong data-campaign="location">VESPER CITY</strong></div>
      <div class="campaign-hud__cell"><span>STATE</span><strong data-campaign="state">ENTRY</strong></div>
    </div>
  `
  document.body.appendChild(hud)

  const rail = document.createElement('div')
  rail.className = 'campaign-rail'
  rail.setAttribute('aria-hidden', 'true')
  rail.innerHTML = '<i class="campaign-rail__progress"></i>'
  document.body.appendChild(rail)

  const scan = document.createElement('div')
  scan.className = 'campaign-scan'
  scan.setAttribute('aria-hidden', 'true')
  document.body.appendChild(scan)

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

  return hud
}

const campaignHud = createCampaignInterface()
const campaignFields = Object.fromEntries(
  [...campaignHud.querySelectorAll('[data-campaign]')].map((el) => [el.dataset.campaign, el])
)

const updateCampaignHud = (scene) => {
  if (!scene) return
  const data = campaignData[scene.id] || {
    act: scene.dataset.scene || '—', track: scene.dataset.scene || '—', pov: '—',
    location: 'VESPER', state: scene.dataset.label || 'ACTIVE', faction: 'neutral', signal: 'STORY THREAD / ACTIVE'
  }

  Object.entries(data).forEach(([key, value]) => {
    if (campaignFields[key]) campaignFields[key].textContent = value
  })

  document.body.dataset.faction = data.faction || 'neutral'
  campaignHud.classList.remove('is-updating')
  void campaignHud.offsetWidth
  campaignHud.classList.add('is-updating')
}

;[...document.querySelectorAll('.first-contact__beat')].forEach((beat, index) => {
  beat.dataset.intel = `INTEL / ${String(index + 1).padStart(2, '0')} / TAEYUN`
})
;[...document.querySelectorAll('.second-look__beat')].forEach((beat, index) => {
  beat.dataset.intel = `INTEL / ${String(index + 1).padStart(2, '0')} / JIWON`
})

initAudioPlayers()

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible')
  })
}, { threshold: 0.22, rootMargin: '0px 0px -8% 0px' })
revealItems.forEach((item) => revealObserver.observe(item))

let lastActiveScene = null
const updateActiveScene = () => {
  if (!scenes.length) return null
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
    const distance = Math.min(Math.abs(rect.top - anchor), Math.abs(rect.bottom - anchor))
    if (distance < nearestDistance) { nearestDistance = distance; active = scene }
  })

  const { scene, label } = active.dataset
  if (sceneNumber) sceneNumber.textContent = scene
  if (sceneLabel) sceneLabel.textContent = label

  if (active !== lastActiveScene) {
    lastActiveScene?.classList.remove('is-campaign-active')
    active.classList.add('is-campaign-active')
    updateCampaignHud(active)
    lastActiveScene = active
  }
  return active
}

const getSectionExitProgress = (section, start = 0.78, duration = 0.17) => {
  if (!section) return 0
  const rect = section.getBoundingClientRect()
  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
  const travelled = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
  return Math.min(Math.max((travelled - start) / duration, 0), 1)
}

const updateTrackExits = () => {
  if (firstContact) firstContact.style.setProperty('--fc-exit', getSectionExitProgress(firstContact).toFixed(3))
  if (secondLook) secondLook.style.setProperty('--sl-exit', getSectionExitProgress(secondLook, 0.79, 0.16).toFixed(3))
}

let ticking = false
const updateScrollEffects = () => {
  ticking = false
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  progressBar?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`)
  document.documentElement.style.setProperty('--campaign-progress', `${Math.min(Math.max(progress,0),1) * 100}%`)

  updateActiveScene()
  updateTrackExits()
  if (reducedMotion) return

  artLayers.forEach((img) => {
    const section = img.closest('[data-scene]')
    if (!section) return
    const rect = section.getBoundingClientRect()
    const sectionProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
    const clamped = Math.min(Math.max(sectionProgress, 0), 1)
    img.style.translate = `0 ${(clamped - 0.5) * 18}px`
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
