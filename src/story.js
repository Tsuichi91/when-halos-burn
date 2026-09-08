import './styles/site.css'
import './styles/story-experience.css'
import './styles/story-world-assets.css'
import './styles/first-contact.css'
import './styles/prologue-player.css'
import './styles/track-handoff.css'
import './styles/second-look.css'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const progressBar = document.querySelector('.story-progress span')
const sceneNumber = document.querySelector('#scene-number')
const sceneLabel = document.querySelector('#scene-label')
const scenes = [...document.querySelectorAll('[data-scene]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const artLayers = [...document.querySelectorAll('.scene-art img, .first-contact__art img, .second-look__art img')]
const firstContact = document.querySelector('.first-contact')
const secondLook = document.querySelector('.second-look')

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible')
  })
}, {
  threshold: 0.22,
  rootMargin: '0px 0px -8% 0px'
})

revealItems.forEach((item) => revealObserver.observe(item))

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

const getSectionExitProgress = (section, start = 0.78, duration = 0.17) => {
  if (!section) return 0

  const rect = section.getBoundingClientRect()
  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
  const travelled = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)

  return Math.min(Math.max((travelled - start) / duration, 0), 1)
}

const updateTrackExits = () => {
  if (firstContact) {
    firstContact.style.setProperty('--fc-exit', getSectionExitProgress(firstContact).toFixed(3))
  }

  if (secondLook) {
    secondLook.style.setProperty('--sl-exit', getSectionExitProgress(secondLook, 0.79, 0.16).toFixed(3))
  }
}

let ticking = false

const updateScrollEffects = () => {
  ticking = false

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  progressBar?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`)

  updateActiveScene()
  updateTrackExits()

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
