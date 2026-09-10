import './styles/world-map-workspace.css'
import './styles/world-map-visual-polish.css'

const root = document.querySelector('#world-app')
const desktopMap = window.matchMedia('(min-width: 1051px)')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

const getPanel = () => root?.querySelector('.world-map-panel')

const preparePanel = () => {
  const panel = getPanel()
  if (!panel) return false
  panel.setAttribute('aria-label', 'Selected Vesper map record and directory')
  panel.dataset.mapWorkspacePanel = ''
  return true
}

const revealSelectedRecord = () => {
  if (!desktopMap.matches) return
  const panel = getPanel()
  if (!panel) return

  requestAnimationFrame(() => {
    panel.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? 'auto' : 'smooth'
    })
  })
}

const shouldRevealForTarget = (target) => Boolean(target?.closest?.(
  '[data-map-node], [data-district-id], [data-map-list], [data-map-filter]'
))

root?.addEventListener('click', (event) => {
  if (shouldRevealForTarget(event.target)) revealSelectedRecord()
})

root?.addEventListener('keydown', (event) => {
  if (!['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) return
  if (shouldRevealForTarget(event.target)) revealSelectedRecord()
})

if (!preparePanel() && root) {
  const observer = new MutationObserver(() => {
    if (!preparePanel()) return
    observer.disconnect()
  })
  observer.observe(root, { childList:true, subtree:true })
  window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
}
