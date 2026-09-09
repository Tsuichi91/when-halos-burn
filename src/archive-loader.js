import './styles/archive-loader.css'

const loader = document.querySelector('[data-archive-loader]')
const status = loader?.querySelector('[data-archive-loader-status]')
const bar = loader?.querySelector('[data-archive-loader-bar]')
const root = document.querySelector('#archive-app')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const waitForImage = (image) => new Promise((resolve) => {
  if (!image) {
    resolve()
    return
  }

  image.loading = 'eager'
  image.decoding = 'async'
  try { image.fetchPriority = 'high' } catch { /* optional browser hint */ }

  let settled = false
  const finish = () => {
    if (settled) return
    settled = true
    image.removeEventListener('load', finish)
    image.removeEventListener('error', finish)

    if (image.complete && image.naturalWidth && typeof image.decode === 'function') {
      image.decode().catch(() => {}).finally(resolve)
    } else {
      resolve()
    }
  }

  if (image.complete) finish()
  else {
    image.addEventListener('load', finish, { once: true })
    image.addEventListener('error', finish, { once: true })
  }
})

const waitForCriticalImages = () => {
  if (!root) return Promise.resolve()

  const critical = [
    root.querySelector('.archive-hero__art img'),
    ...root.querySelectorAll('.archive-record-grid .archive-record__image img')
  ].filter(Boolean).slice(0, 3)

  if (!critical.length) return Promise.resolve()

  return Promise.race([
    Promise.all(critical.map(waitForImage)),
    new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 2600 : 4800))
  ])
}

if (loader) {
  const startedAt = performance.now()
  let archiveReady = Boolean(root?.children.length)
  let revealStarted = false

  const stages = reducedMotion
    ? [
        [0, 'ESTABLISHING ACCESS CHANNEL', '35%'],
        [160, 'LOADING PRIMARY RECORDS', '92%']
      ]
    : [
        [0, 'ESTABLISHING ACCESS CHANNEL', '12%'],
        [300, 'INDEXING RECORDS', '38%'],
        [650, 'VERIFYING CLEARANCE', '67%'],
        [980, 'SYNCING VESPER DATABASE', '88%'],
        [1220, 'LOADING PRIMARY RECORDS', '94%']
      ]

  stages.forEach(([delay, label, progress]) => {
    window.setTimeout(() => {
      if (status) status.textContent = label
      if (bar) bar.style.setProperty('--archive-load-progress', progress)
    }, delay)
  })

  const reveal = async () => {
    if (revealStarted) return
    revealStarted = true

    await waitForCriticalImages()

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
