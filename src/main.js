import './styles/site.css'
import './styles/landing.css'
import './styles/title-image.css'
import './styles/landing-game-ui.css'

const landing = document.querySelector('.landing-game')
const art = document.querySelector('.landing__art')
const modeLinks = [...document.querySelectorAll('.game-mode')]
const routeLinks = document.querySelectorAll('[data-route]')
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
}

setActiveMode(modeLinks[0])

modeLinks.forEach((link) => {
  link.addEventListener('pointerenter', () => setActiveMode(link))
  link.addEventListener('focus', () => setActiveMode(link))
})

document.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
  if (!modeLinks.length) return

  event.preventDefault()

  const currentIndex = Math.max(0, modeLinks.findIndex((link) => link.classList.contains('is-selected')))
  const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1
  const nextIndex = (currentIndex + direction + modeLinks.length) % modeLinks.length
  const nextLink = modeLinks[nextIndex]

  setActiveMode(nextLink)
  nextLink.focus({ preventScroll: true })
})

if (landing && art && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  landing.addEventListener('pointermove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5

    art.style.setProperty('--art-x', `${x * -9}px`)
    art.style.setProperty('--art-y', `${y * -5}px`)
  })

  landing.addEventListener('pointerleave', () => {
    art.style.setProperty('--art-x', '0px')
    art.style.setProperty('--art-y', '0px')
  })
}

routeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (reducedMotion || !landing) return

    event.preventDefault()
    const href = link.getAttribute('href')
    if (!href) return

    landing.classList.add('is-leaving')

    window.setTimeout(() => {
      window.location.href = href
    }, 680)
  })
})
