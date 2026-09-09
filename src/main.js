import './styles/site.css'
import './styles/landing.css'
import './styles/title-image.css'
import './styles/landing-game-ui.css'
import './styles/landing-game-fixes.css'
import './styles/landing-game-v2.css'

const landing = document.querySelector('.landing-game')
const art = document.querySelector('.landing__art')
const title = document.querySelector('.game-title')
const reticle = document.querySelector('.game-reticle')
const orbit = document.querySelector('.game-reticle-orbit')
const modeLinks = [...document.querySelectorAll('.game-mode')]
const routeLinks = document.querySelectorAll('[data-route]')
const routeLoader = document.querySelector('.game-loading-route')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

requestAnimationFrame(() => {
  document.body.classList.add('is-ready')
})

const setActiveMode = (link) => {
  if (!landing || !link) return

  const mode = link.dataset.mode || 'story'
  landing.dataset.activeMode = mode

  modeLinks.forEach((item) => {
    const selected = item === link
    item.classList.toggle('is-selected', selected)
    item.setAttribute('aria-current', selected ? 'true' : 'false')
  })

  if (routeLoader) {
    const label = routeLoader.querySelector('strong')
    if (label) label.textContent = mode === 'archive' ? 'ARCHIVE MODE' : 'STORY MODE'
  }
}

const getSelectedMode = () => modeLinks.find((link) => link.classList.contains('is-selected')) || modeLinks[0]

const confirmRoute = (link) => {
  if (!link || !landing) return

  const href = link.getAttribute('href')
  if (!href) return

  if (reducedMotion) {
    window.location.href = href
    return
  }

  landing.classList.add('is-confirming', 'is-leaving')

  window.setTimeout(() => {
    window.location.href = href
  }, 720)
}

setActiveMode(modeLinks[0])

modeLinks.forEach((link) => {
  link.addEventListener('pointerenter', () => setActiveMode(link))
  link.addEventListener('focus', () => setActiveMode(link))
})

document.addEventListener('keydown', (event) => {
  if (!modeLinks.length) return

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault()

    const currentIndex = Math.max(0, modeLinks.findIndex((link) => link.classList.contains('is-selected')))
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1
    const nextIndex = (currentIndex + direction + modeLinks.length) % modeLinks.length
    const nextLink = modeLinks[nextIndex]

    setActiveMode(nextLink)
    nextLink.focus({ preventScroll: true })
    return
  }

  if (event.key === 'Enter' && document.activeElement?.tagName !== 'A') {
    event.preventDefault()
    confirmRoute(getSelectedMode())
  }
})

if (landing && art && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  landing.addEventListener('pointermove', (event) => {
    const px = event.clientX / window.innerWidth
    const py = event.clientY / window.innerHeight
    const x = px - 0.5
    const y = py - 0.5

    landing.style.setProperty('--cursor-x', `${(px * 100).toFixed(2)}%`)
    landing.style.setProperty('--cursor-y', `${(py * 100).toFixed(2)}%`)
    art.style.setProperty('--art-x', `${x * -15}px`)
    art.style.setProperty('--art-y', `${y * -8}px`)

    if (title) title.style.transform = `translate(calc(-50% + ${x * 4}px), calc(-50% + ${y * 2}px))`
    if (reticle) reticle.style.marginLeft = `${x * 3}px`
    if (orbit) orbit.style.marginLeft = `${x * 5}px`
  })

  landing.addEventListener('pointerleave', () => {
    art.style.setProperty('--art-x', '0px')
    art.style.setProperty('--art-y', '0px')
    if (title) title.style.transform = 'translate(-50%, -50%)'
    if (reticle) reticle.style.marginLeft = '0px'
    if (orbit) orbit.style.marginLeft = '0px'
  })
}

routeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault()
    setActiveMode(link)
    confirmRoute(link)
  })
})
