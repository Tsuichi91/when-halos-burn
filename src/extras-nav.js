const installQaStyles = () => {
  if (document.querySelector('[data-qa-navigation-style]')) return
  const style = document.createElement('style')
  style.dataset.qaNavigationStyle = ''
  style.textContent = `
    @media (min-width:821px) and (max-width:1080px) {
      .archive-topbar__nav a[href$="extras.html"] { display:none; }
    }
    @media (min-width:781px) and (max-width:1080px) {
      .chapter-topbar__nav a[href$="extras.html"] { display:none; }
    }
  `
  document.head.appendChild(style)
}

const activateExtrasLinks = () => {
  document.querySelectorAll('nav [aria-disabled="true"]').forEach((placeholder) => {
    const label = placeholder.textContent?.trim().toUpperCase()
    if (!label?.includes('EXTRAS')) return

    const link = document.createElement('a')
    ;[...placeholder.attributes].forEach((attribute) => {
      if (!['aria-disabled','type'].includes(attribute.name)) link.setAttribute(attribute.name, attribute.value)
    })
    link.href = './extras.html'
    link.innerHTML = placeholder.innerHTML
    placeholder.replaceWith(link)
  })
}

const focusOpenDialog = () => {
  const dialog = [...document.querySelectorAll('[role="dialog"]')].find((item) => !item.hidden)
  if (!dialog || dialog.contains(document.activeElement)) return

  const closeButton = dialog.querySelector(
    'button.archive-document-sheet__close, button.archive-location-dossier__close, button.archive-lightbox__close, button[data-lightbox-close]'
  )
  closeButton?.focus({ preventScroll:true })
}

let focusQueued = false
const queueDialogFocus = () => {
  if (focusQueued) return
  focusQueued = true
  requestAnimationFrame(() => {
    focusQueued = false
    focusOpenDialog()
  })
}

installQaStyles()
activateExtrasLinks()

const observer = new MutationObserver(() => {
  activateExtrasLinks()
  queueDialogFocus()
})
observer.observe(document.documentElement,{ childList:true, subtree:true, attributes:true, attributeFilter:['hidden'] })

document.addEventListener('click', queueDialogFocus, true)
document.addEventListener('keydown', queueDialogFocus, true)
window.addEventListener('pageshow', () => {
  activateExtrasLinks()
  queueDialogFocus()
})
window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
