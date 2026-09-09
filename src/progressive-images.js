const tuneImage = (image) => {
  if (!(image instanceof HTMLImageElement)) return

  image.decoding = 'async'

  const critical = image.closest('.scene-art--vesper, .scene-art--halo, .scene-art--eclipse, .story-home__hero-art, .archive-hero__art, .archive-featured__blackout')
  const deferred = image.closest('.story-home-card, .archive-record, .archive-chapter, .archive-visual-grid')

  if (critical) {
    image.loading = 'eager'
    try { image.fetchPriority = image.closest('.scene-art--vesper, .story-home__hero-art, .archive-hero__art') ? 'high' : 'auto' } catch { /* optional browser hint */ }
    return
  }

  if (deferred) {
    image.loading = 'lazy'
    try { image.fetchPriority = 'low' } catch { /* optional browser hint */ }
  }
}

const scan = (node) => {
  if (node instanceof HTMLImageElement) tuneImage(node)
  if (node instanceof Element || node instanceof Document) node.querySelectorAll('img').forEach(tuneImage)
}

scan(document)

const observer = new MutationObserver((records) => {
  records.forEach((record) => record.addedNodes.forEach(scan))
})

observer.observe(document.documentElement, { childList: true, subtree: true })

window.addEventListener('pagehide', () => observer.disconnect(), { once: true })
