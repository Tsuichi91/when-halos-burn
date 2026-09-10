import './styles/world-map-workspace.css'

const root = document.querySelector('#world-app')
const desktopMap = window.matchMedia('(min-width: 1051px)')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const MAP_ASPECT = 1640 / 928

const getPanel = () => root?.querySelector('.world-map-panel')

const sizeDesktopWorkspace = () => {
  if (!desktopMap.matches) {
    const shell = root?.querySelector('.world-map-shell')
    if (shell) shell.style.removeProperty('--map-workspace-height')
    return
  }
  const shell = root?.querySelector('.world-map-shell')
  const canvas = root?.querySelector('.world-map-canvas')
  if (!shell || !canvas) return
  const height = Math.max(420, Math.round(canvas.getBoundingClientRect().width / MAP_ASPECT))
  shell.style.setProperty('--map-workspace-height', `${height}px`)
}

const observeWorkspace = () => {
  sizeDesktopWorkspace()
  const canvas = root?.querySelector('.world-map-canvas')
  if (!canvas || typeof ResizeObserver === 'undefined') return
  const observer = new ResizeObserver(() => sizeDesktopWorkspace())
  observer.observe(canvas)
  window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
}


const preparePanel = () => {
  const panel = getPanel()
  if (!panel) return false
  panel.setAttribute('aria-label', 'Selected Vesper map record and directory')
  panel.dataset.mapWorkspacePanel = ''
  sizeDesktopWorkspace()
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


window.addEventListener('resize', sizeDesktopWorkspace, { passive:true })
desktopMap.addEventListener?.('change', sizeDesktopWorkspace)
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeWorkspace, { once:true })
else observeWorkspace()
