import './styles/site.css'
import './styles/landing.css'
import './styles/title-reference.css'

const landing = document.querySelector('.landing')
const art = document.querySelector('.landing__art')
const enterButton = document.querySelector('#enter-vesper')
const returnButton = document.querySelector('#return-to-title')
const modeSelection = document.querySelector('#mode-selection')
const routeLinks = document.querySelectorAll('[data-route]')
const albumTitle = document.querySelector('#album-title')
const titleO = document.querySelector('.title-o')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

requestAnimationFrame(() => {
  document.body.classList.add('is-ready')
})

const alignTitleOToBeam = () => {
  if (!albumTitle || !titleO) return

  if (window.innerWidth <= 620) {
    albumTitle.style.setProperty('--title-shift', '0px')
    return
  }

  albumTitle.style.setProperty('--title-shift', '0px')

  requestAnimationFrame(() => {
    const rect = titleO.getBoundingClientRect()
    const oCenter = rect.left + rect.width / 2
    const viewportCenter = window.innerWidth / 2
    const shift = viewportCenter - oCenter

    albumTitle.style.setProperty('--title-shift', `${shift.toFixed(1)}px`)
  })
}

if (document.fonts?.ready) {
  document.fonts.ready.then(alignTitleOToBeam)
} else {
  window.addEventListener('load', alignTitleOToBeam, { once: true })
}

window.addEventListener('resize', alignTitleOToBeam)

const setModeStage = (entered) => {
  if (!landing || !modeSelection || !enterButton) return

  landing.classList.toggle('is-entered', entered)
  modeSelection.setAttribute('aria-hidden', entered ? 'false' : 'true')
  enterButton.setAttribute('aria-expanded', entered ? 'true' : 'false')

  if (entered) {
    window.setTimeout(() => {
      modeSelection.querySelector('a')?.focus({ preventScroll: true })
    }, reducedMotion ? 0 : 900)
  } else {
    window.setTimeout(() => {
      enterButton.focus({ preventScroll: true })
    }, reducedMotion ? 0 : 650)
  }
}

enterButton?.addEventListener('click', () => setModeStage(true))
returnButton?.addEventListener('click', () => setModeStage(false))

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && landing?.classList.contains('is-entered')) {
    setModeStage(false)
  }
})

if (landing && art && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  landing.addEventListener('pointermove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5
    const y = event.clientY / window.innerHeight - 0.5

    art.style.setProperty('--art-x', `${x * -10}px`)
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
    landing.classList.add('is-leaving')

    window.setTimeout(() => {
      window.location.href = href
    }, 760)
  })
})
