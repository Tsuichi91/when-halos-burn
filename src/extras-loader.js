import './styles/extras-loader.css'

const loader = document.querySelector('[data-extras-loader]')
const status = loader?.querySelector('[data-extras-loader-status]')
const bar = loader?.querySelector('[data-extras-loader-bar]')
const root = document.querySelector('#extras-app')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const waitForHero = () => new Promise((resolve) => {
  const find = () => root?.querySelector('.extras-hero__art img')
  const image = find()
  if (!image) return resolve()
  image.loading = 'eager'
  try { image.fetchPriority = 'high' } catch { /* optional */ }
  if (image.complete) return image.decode?.().catch(() => {}).finally(resolve) || resolve()
  image.addEventListener('load', resolve, { once:true })
  image.addEventListener('error', resolve, { once:true })
})

if (loader) {
  const startedAt = performance.now()
  let revealed = false
  const stages = reducedMotion
    ? [[0,'OPENING PRODUCTION FILES','52%'],[120,'LOADING BONUS MATERIAL','94%']]
    : [[0,'OPENING PRODUCTION FILES','14%'],[180,'ASSEMBLING VISUAL DEVELOPMENT','36%'],[380,'INDEXING MUSIC DESIGN','58%'],[570,'LOADING CREATIVE NOTES','78%'],[740,'LOADING BONUS MATERIAL','94%']]

  stages.forEach(([delay,label,progress]) => window.setTimeout(() => {
    if (status) status.textContent = label
    if (bar) bar.style.setProperty('--extras-load-progress', progress)
  }, delay))

  const reveal = async () => {
    if (revealed) return
    revealed = true
    await Promise.race([waitForHero(), new Promise((resolve) => setTimeout(resolve, reducedMotion ? 1200 : 3200))])
    const minimum = reducedMotion ? 120 : 780
    const wait = Math.max(0, minimum - (performance.now() - startedAt))
    window.setTimeout(() => {
      if (status) status.textContent = 'EXTRAS AVAILABLE'
      if (bar) bar.style.setProperty('--extras-load-progress','100%')
      loader.classList.add('is-leaving')
      window.setTimeout(() => loader.remove(), reducedMotion ? 180 : 650)
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
    window.setTimeout(() => { observer.disconnect(); reveal() }, 2600)
  } else reveal()
}
