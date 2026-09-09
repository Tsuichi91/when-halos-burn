const root = document.querySelector('#archive-app')
let queued = false

const sync = () => {
  if (!root) return
  const content = root.querySelector('[data-archive-content]')
  const active = root.querySelector('[data-archive-category].is-active')?.dataset.archiveCategory
  if (!content || !active) return

  if (!['characters','music','notes','timeline'].includes(active)) {
    delete content.dataset.enhancedView
  }

  if (active !== 'characters') return

  const grid = content.querySelector('.archive-record-grid')
  if (!grid) return
  grid.classList.add('archive-character-grid')

  grid.querySelectorAll('.archive-record--person').forEach((card, index) => {
    card.classList.add('archive-character-card')
    card.dataset.character = ['JIWON','TAEYUN','SEOJUN'][index] || `CHAR-${index + 1}`
    const image = card.querySelector('img')
    if (image) {
      image.loading = 'eager'
      image.decoding = 'async'
    }
  })
}

const queue = () => {
  if (queued) return
  queued = true
  requestAnimationFrame(() => {
    queued = false
    sync()
  })
}

const initialize = () => {
  if (!root) return
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-archive-category]')) queue()
  })
  const observer = new MutationObserver(queue)
  observer.observe(root, { childList: true, subtree: true })
  queue()
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true })
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true })
else initialize()
