const routeWorldLinks = () => {
  document.querySelectorAll('a[href*="story.html?world=1#vesper"]').forEach((link) => {
    link.href = './world.html'
  })
}

const handleWorldButton = (event) => {
  const trigger = event.target.closest('[data-full-replay-world], [data-replay-world-intro]')
  if (!trigger) return
  event.preventDefault()
  event.stopImmediatePropagation()
  window.location.href = './world.html'
}

routeWorldLinks()
document.addEventListener('click', handleWorldButton, true)

const observer = new MutationObserver(routeWorldLinks)
observer.observe(document.documentElement, { childList:true, subtree:true })
window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
