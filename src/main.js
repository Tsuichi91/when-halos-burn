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
let routeInFlight = false

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

const getCriticalAssets = (mode) => {
  if (mode === 'archive') {
    return [
      './images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png',
      './images/tracks/03-hold-the-line/hero.png',
      './images/tracks/02-no-saint/hero.png'
    ]
  }

  let hasSeenWorldIntro = false
  try { hasSeenWorldIntro = window.localStorage.getItem('whb-world-intro-seen-v1') === '1' } catch { /* storage optional */ }

  return hasSeenWorldIntro
    ? [
        './images/landing/vesper-city.png',
        './images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png',
        './images/tracks/01b-first-contact/hero.png',
        './images/tracks/01c-second-look/hero.png'
      ]
    : [
        './images/landing/vesper-city.png',
        './images/world/halo-headquarters.png',
        './images/world/eclipse-headquarters.png'
      ]
}

const warmImage = (src) => new Promise((resolve) => {
  const image = new Image()
  const finish = () => {
    image.onload = null
    image.onerror = null
    if (typeof image.decode === 'function' && image.complete && image.naturalWidth) {
      image.decode().catch(() => {}).finally(resolve)
    } else {
      resolve()
    }
  }
  image.onload = finish
  image.onerror = finish
  image.src = src
  if (image.complete) finish()
})

const preloadCriticalAssets = (mode) => {
  const timeout = reducedMotion ? 2600 : 4800
  return Promise.race([
    Promise.all(getCriticalAssets(mode).map(warmImage)),
    new Promise((resolve) => window.setTimeout(resolve, timeout))
  ])
}

const confirmRoute = async (link) => {
  if (!link || !landing || routeInFlight) return

  const href = link.getAttribute('href')
  if (!href) return

  routeInFlight = true
  const mode = link.dataset.mode || 'story'
  const startedAt = performance.now()

  landing.classList.add('is-confirming', 'is-leaving')

  await preloadCriticalAssets(mode)

  const minimum = reducedMotion ? 120 : 720
  const elapsed = performance.now() - startedAt
  const remaining = Math.max(0, minimum - elapsed)

  window.setTimeout(() => {
    window.location.href = href
  }, remaining)
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
