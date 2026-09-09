import './styles/archive-loader.css'

const loader = document.querySelector('[data-archive-loader]')
const status = loader?.querySelector('[data-archive-loader-status]')
const bar = loader?.querySelector('[data-archive-loader-bar]')
const root = document.querySelector('#archive-app')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (loader) {
  const startedAt = performance.now()
  let archiveReady = Boolean(root?.children.length)

  const stages = reducedMotion
    ? [
        [0, 'ESTABLISHING ACCESS CHANNEL', '35%'],
        [160, 'ARCHIVE ACCESS GRANTED', '100%']
      ]
    : [
        [0, 'ESTABLISHING ACCESS CHANNEL', '12%'],
        [300, 'INDEXING RECORDS', '38%'],
        [650, 'VERIFYING CLEARANCE', '67%'],
        [980, 'SYNCING VESPER DATABASE', '88%'],
        [1220, 'ARCHIVE ACCESS GRANTED', '100%']
      ]

  stages.forEach(([delay, label, progress]) => {
    window.setTimeout(() => {
      if (status) status.textContent = label
      if (bar) bar.style.setProperty('--archive-load-progress', progress)
    }, delay)
  })

  const reveal = () => {
    const minimum = reducedMotion ? 250 : 1420
    const elapsed = performance.now() - startedAt
    const wait = Math.max(0, minimum - elapsed)

    window.setTimeout(() => {
      if (status) status.textContent = 'ARCHIVE ACCESS GRANTED'
      if (bar) bar.style.setProperty('--archive-load-progress', '100%')
      loader.classList.add('is-leaving')
      window.setTimeout(() => loader.remove(), reducedMotion ? 180 : 700)
    }, wait)
  }

  if (!archiveReady && root) {
    const observer = new MutationObserver(() => {
      if (!root.children.length) return
      archiveReady = true
      observer.disconnect()
      reveal()
    })
    observer.observe(root, { childList: true })

    window.setTimeout(() => {
      if (!archiveReady) {
        observer.disconnect()
        reveal()
      }
    }, 3200)
  } else {
    reveal()
  }
}
