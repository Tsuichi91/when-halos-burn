import './styles/site.css'
import './styles/story-experience.css'
import './styles/story-world-assets.css'

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const progressBar = document.querySelector('.story-progress span')
const sceneNumber = document.querySelector('#scene-number')
const sceneLabel = document.querySelector('#scene-label')
const scenes = [...document.querySelectorAll('[data-scene]')]
const revealItems = [...document.querySelectorAll('[data-reveal]')]
const artLayers = [...document.querySelectorAll('.scene-art img')]

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible')
  })
}, {
  threshold: 0.22,
  rootMargin: '0px 0px -8% 0px'
})

revealItems.forEach((item) => revealObserver.observe(item))

const sceneObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

  if (!visible) return

  const { scene, label } = visible.target.dataset
  if (sceneNumber) sceneNumber.textContent = scene
  if (sceneLabel) sceneLabel.textContent = label
}, {
  threshold: [0.2, 0.35, 0.5, 0.7]
})

scenes.forEach((scene) => sceneObserver.observe(scene))

let ticking = false

const updateScrollEffects = () => {
  ticking = false

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0
  progressBar?.style.setProperty('transform', `scaleX(${Math.min(Math.max(progress, 0), 1)})`)

  if (reducedMotion) return

  artLayers.forEach((img) => {
    const section = img.closest('.story-scene')
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
