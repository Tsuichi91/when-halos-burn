const activateExtrasLinks = () => {
  document.querySelectorAll('nav span[aria-disabled="true"]').forEach((span) => {
    const label = span.textContent?.trim().toUpperCase()
    if (!label?.includes('EXTRAS')) return
    const link = document.createElement('a')
    ;[...span.attributes].forEach((attribute) => {
      if (attribute.name !== 'aria-disabled') link.setAttribute(attribute.name, attribute.value)
    })
    link.href = './extras.html'
    link.innerHTML = span.innerHTML
    span.replaceWith(link)
  })
}

activateExtrasLinks()
const observer = new MutationObserver(activateExtrasLinks)
observer.observe(document.documentElement,{ childList:true, subtree:true })
window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
