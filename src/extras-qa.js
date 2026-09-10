import './styles/typography-accessibility.css'

const root = document.querySelector('#extras-app')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let previousFrame = null

const restoreFrameFocus = () => {
  if (!previousFrame?.isConnected) {
    previousFrame = null
    return
  }
  requestAnimationFrame(() => {
    previousFrame?.focus?.({ preventScroll:true })
    previousFrame = null
  })
}

const queueRestoreAfterClose = () => {
  requestAnimationFrame(() => {
    const box = root?.querySelector('[data-extras-lightbox]')
    if (box?.hidden) restoreFrameFocus()
  })
}

document.addEventListener('click', (event) => {
  const frame = event.target.closest?.('[data-extra-image]')
  if (frame) previousFrame = frame

  if (event.target.closest?.('[data-lightbox-close]')) queueRestoreAfterClose()

  if (reducedMotion && event.target.closest?.('[data-reveal-spoilers]')) {
    requestAnimationFrame(() => {
      const content = root?.querySelector('[data-spoiler-content]:not([hidden])')
      content?.scrollIntoView({ behavior:'auto', block:'nearest' })
    })
  }
}, true)

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  const box = root?.querySelector('[data-extras-lightbox]')
  if (box && !box.hidden) queueRestoreAfterClose()
}, true)

const observer = new MutationObserver((records) => {
  if (!previousFrame) return
  const closed = records.some((record) => record.type === 'attributes' && record.attributeName === 'hidden' && record.target.matches?.('[data-extras-lightbox]') && record.target.hidden)
  if (closed) restoreFrameFocus()
})

const observeLightbox = () => {
  const box = root?.querySelector('[data-extras-lightbox]')
  if (!box) return false
  observer.observe(box, { attributes:true, attributeFilter:['hidden'] })
  return true
}

if (!observeLightbox() && root) {
  const rootObserver = new MutationObserver(() => {
    if (!observeLightbox()) return
    rootObserver.disconnect()
  })
  rootObserver.observe(root, { childList:true, subtree:true })
  window.addEventListener('pagehide', () => rootObserver.disconnect(), { once:true })
}

window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
