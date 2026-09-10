import './styles/world-loader.css'

const loader = document.querySelector('[data-world-loader]')
const status = loader?.querySelector('[data-world-loader-status]')
const bar = loader?.querySelector('[data-world-loader-bar]')
const root = document.querySelector('#world-app')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const waitForImage = (image) => new Promise((resolve) => {
  if (!image) return resolve()
  image.loading = 'eager'
  image.decoding = 'async'
  try { image.fetchPriority = 'high' } catch { /* optional browser hint */ }

  let settled = false
  const finish = () => {
    if (settled) return
    settled = true
    image.removeEventListener('load', finish)
    image.removeEventListener('error', finish)
    if (image.complete && image.naturalWidth && typeof image.decode === 'function') image.decode().catch(() => {}).finally(resolve)
    else resolve()
  }

  if (image.complete) finish()
  else {
    image.addEventListener('load', finish, { once:true })
    image.addEventListener('error', finish, { once:true })
  }
})

const waitForCriticalImages = () => {
  if (!root) return Promise.resolve()
  const critical = [
    root.querySelector('.world-hero__art img'),
    root.querySelector('.world-system--halo img'),
    root.querySelector('.world-system--eclipse img')
  ].filter(Boolean)
  if (!critical.length) return Promise.resolve()
  return Promise.race([
    Promise.all(critical.map(waitForImage)),
    new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 2200 : 4200))
  ])
}

if (loader) {
  const startedAt = performance.now()
  let revealStarted = false

  const stages = reducedMotion
    ? [[0,'CONNECTING CITY NETWORK','42%'],[140,'RENDERING WORLD LAYER','92%']]
    : [
        [0,'CONNECTING CITY NETWORK','12%'],
        [220,'SYNCING VESPER GRID','34%'],
        [440,'RESOLVING CIVIC LAYERS','56%'],
        [650,'LOCATING SYSTEM NODES','76%'],
        [820,'RENDERING WORLD MAP','94%']
      ]

  stages.forEach(([delay,label,progress]) => window.setTimeout(() => {
    if (status) status.textContent = label
    if (bar) bar.style.setProperty('--world-load-progress', progress)
  }, delay))

  const reveal = async () => {
    if (revealStarted) return
    revealStarted = true
    await waitForCriticalImages()
    const minimum = reducedMotion ? 160 : 820
    const wait = Math.max(0, minimum - (performance.now() - startedAt))
    window.setTimeout(() => {
      if (status) status.textContent = 'WORLD LAYER ONLINE'
      if (bar) bar.style.setProperty('--world-load-progress','100%')
      loader.classList.add('is-leaving')
      window.setTimeout(() => loader.remove(), reducedMotion ? 160 : 620)
    }, wait)
  }

  if (root?.children.length) reveal()
  else if (root) {
    const observer = new MutationObserver(() => {
      if (!root.children.length) return
      observer.disconnect()
      reveal()
    })
    observer.observe(root,{ childList:true })
    window.setTimeout(() => { observer.disconnect(); reveal() }, 2800)
  } else reveal()
}
