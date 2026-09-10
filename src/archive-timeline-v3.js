import './styles/archive-timeline-v3.css'

const root = document.querySelector('#archive-app')
let healQueued = false

const content = () => root?.querySelector('[data-archive-content]')
const timelineButton = () => root?.querySelector('[data-archive-category="timeline"]')
const currentCategory = () => root?.querySelector('[data-archive-category].is-active')?.dataset.archiveCategory || ''

const prepareTimelineRender = () => {
  const target = content()
  if (!target) return
  delete target.dataset.enhancedView
}

const healTimeline = () => {
  if (healQueued) return
  healQueued = true
  requestAnimationFrame(() => {
    healQueued = false
    if (currentCategory() !== 'timeline') return
    const target = content()
    if (!target || target.querySelector('.archive-timeline-v2')) return
    if (!target.querySelector('.archive-timeline')) return
    prepareTimelineRender()
    timelineButton()?.click()
  })
}

const initialize = () => {
  if (!root) return

  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-archive-category="timeline"]')) return
    prepareTimelineRender()
  }, true)

  const observer = new MutationObserver(healTimeline)
  observer.observe(root, { childList:true, subtree:true })

  window.addEventListener('pageshow', () => {
    if (currentCategory() !== 'timeline') return
    const target = content()
    if (target?.querySelector('.archive-timeline-v2')) return
    prepareTimelineRender()
    timelineButton()?.click()
  })

  window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
  healTimeline()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
