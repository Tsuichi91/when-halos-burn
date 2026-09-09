import './styles/archive-interactions.css'
import { chapterList } from './chapter-data.js'

const root = document.querySelector('#archive-app')
let queued = false
let lightboxItems = []
let lightboxIndex = 0
let previousFocus = null

const characterProfiles = {
  JIWON: {
    id: 'CHAR-01',
    name: 'HAN JIWON',
    subtitle: 'AEGIS / HALO GUARD',
    fields: [
      ['AGE', '29'],
      ['AFFILIATION', 'HALO GUARD'],
      ['DESIGNATION', 'AEGIS'],
      ['CORE', 'PROTECTION'],
      ['STATUS', 'ACTIVE / 2164']
    ],
    bio: 'Han Jiwon is an elite HALO Guard officer shaped by discipline, protection and precision. When the official record stops matching the evidence, he investigates rather than obeys certainty. Beneath the uniform he is warmer and more empathetic than his restraint suggests. His arc is about reclaiming Aegis as something that belongs to Jiwon — not to HALO.',
    tags: ['PROTECTION', 'CHOICE', 'STAY', 'AGENCY']
  },
  TAEYUN: {
    id: 'CHAR-02',
    name: 'KANG TAEYUN',
    subtitle: 'THE ARCHITECT / ECLIPSE',
    fields: [
      ['AGE', '32'],
      ['AFFILIATION', 'ECLIPSE'],
      ['DESIGNATION', 'THE ARCHITECT'],
      ['FORMER', 'HALO INSIDER'],
      ['CORE', 'TRUTH']
    ],
    bio: 'Kang Taeyun is a former HALO insider who uncovered illegal surveillance and political classification within the system. After internal exposure failed, he became an Eclipse strategist willing to manipulate and lie in pursuit of the truth. Jiwon begins as a route to the sealed archive and becomes the person who breaks the plan. Taeyun’s conflict is whether truth means anything without accountability.',
    tags: ['TRUTH', 'ECLIPSE', 'CONTROL', 'ACCOUNTABILITY']
  },
  SEOJUN: {
    id: 'CHAR-03',
    name: 'HAN SEOJUN',
    subtitle: 'HALO MARTYR / BLACKOUT RECORD',
    fields: [
      ['RELATION', 'JIWON / OLDER BROTHER'],
      ['PUBLIC RECORD', 'HALO MARTYR'],
      ['BLACKOUT', '2158'],
      ['ARCHIVE ROLE', 'WITNESS / DATA FRAGMENT'],
      ['STATUS', 'DECEASED']
    ],
    bio: 'Han Seojun is Jiwon’s older brother and a witness whose history was rewritten after the Blackout. He discovered evidence of HALO wrongdoing and was shot by Council internal forces in 2158. Before dying, he gave Taeyun a surviving data fragment and asked that the truth be preserved. HALO later turned the witness into a clean public martyr.',
    tags: ['BLACKOUT', 'WITNESS', 'SEOJUN', 'SEALED RECORD']
  }
}

const locationVisuals = [
  { group:'LOCATIONS', title:'VESPER CITY', meta:'PRIMARY SETTING / 2164', src:'./images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png' },
  { group:'LOCATIONS', title:'HALO HEADQUARTERS', meta:'CONTROL GRID / CIVIC AUTHORITY', src:'./images/world/halo-headquarters.png' },
  { group:'LOCATIONS', title:'ECLIPSE HUB', meta:'SHADOW GRID / OLD TRANSIT', src:'./images/world/eclipse-headquarters.png' },
  { group:'LOCATIONS', title:'THE OBSERVATORY', meta:'NEUTRAL GROUND / RECURRING LOCATION', src:'./images/archive/locations/observatory.png' },
  { group:'LOCATIONS', title:'HALO CORE', meta:'SEALED ARCHIVE / CENTRAL SYSTEM', src:'./images/archive/locations/halo-core.png' }
]

const characterVisuals = [
  { group:'CHARACTERS', title:'HAN JIWON', meta:'AEGIS / HALO GUARD', src:'./images/archive/characters/han-jiwon.png' },
  { group:'CHARACTERS', title:'KANG TAEYUN', meta:'THE ARCHITECT / ECLIPSE', src:'./images/archive/characters/kang-taeyun.png' },
  { group:'CHARACTERS', title:'HAN SEOJUN', meta:'HALO MARTYR / BLACKOUT RECORD', src:'./images/archive/characters/han-seojun.png' }
]

const allVisuals = () => [
  ...chapterList.map((chapter) => ({
    group: 'CHAPTER ART',
    title: chapter.title,
    meta: `${chapter.display} / ${chapter.code} / ${chapter.perspective}`,
    src: chapter.image
  })),
  ...characterVisuals,
  ...locationVisuals
]

const currentCategory = () => root?.querySelector('[data-archive-category].is-active')?.dataset.archiveCategory || ''
const searchTerm = () => root?.querySelector('[data-archive-search]')?.value.trim().toLowerCase() || ''

const enhanceCharacters = () => {
  if (!root || currentCategory() !== 'characters') return
  const cards = root.querySelectorAll('.archive-character-card')
  cards.forEach((card, index) => {
    if (card.dataset.flipReady === '1') return
    const key = card.dataset.character || ['JIWON','TAEYUN','SEOJUN'][index]
    const profile = characterProfiles[key]
    if (!profile) return

    card.dataset.flipReady = '1'
    card.setAttribute('role', 'button')
    card.setAttribute('tabindex', '0')
    card.setAttribute('aria-pressed', 'false')
    card.setAttribute('aria-label', `Open dossier for ${profile.name}`)

    const front = document.createElement('div')
    front.className = 'archive-character-face archive-character-face--front'
    while (card.firstChild) front.appendChild(card.firstChild)
    front.insertAdjacentHTML('beforeend', '<span class="archive-character-flip-hint" aria-hidden="true">OPEN DOSSIER ↻</span>')

    const back = document.createElement('section')
    back.className = 'archive-character-face archive-character-face--back'
    back.innerHTML = `
      <div class="archive-character-dossier__head"><span>${profile.id} / PERSONNEL RECORD</span><i>VERIFIED</i></div>
      <div class="archive-character-dossier__title"><small>${profile.subtitle}</small><h3>${profile.name}</h3></div>
      <dl class="archive-character-dossier__fields">
        ${profile.fields.map(([label,value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}
      </dl>
      <div class="archive-character-dossier__bio"><span>ARCHIVE BIO</span><p>${profile.bio}</p></div>
      <div class="archive-character-dossier__tags">${profile.tags.map((tag) => `<i>${tag}</i>`).join('')}</div>
      <span class="archive-character-flip-hint archive-character-flip-hint--back" aria-hidden="true">RETURN TO PORTRAIT ↻</span>
    `

    const inner = document.createElement('div')
    inner.className = 'archive-character-card__inner'
    inner.append(front, back)
    card.appendChild(inner)
  })
}

const toggleCharacter = (card) => {
  if (!card?.dataset.flipReady) return
  const flipped = card.classList.toggle('is-flipped')
  card.setAttribute('aria-pressed', flipped ? 'true' : 'false')
  const key = card.dataset.character || ''
  const profile = characterProfiles[key]
  if (profile) card.setAttribute('aria-label', `${flipped ? 'Return to portrait for' : 'Open dossier for'} ${profile.name}`)
}

const visualMatches = (record, query) => !query || `${record.group} ${record.title} ${record.meta}`.toLowerCase().includes(query)

const renderVisuals = () => {
  if (!root || currentCategory() !== 'visuals') return
  const content = root.querySelector('[data-archive-content]')
  if (!content || content.querySelector('.archive-visuals-v2')) return

  const query = searchTerm()
  const records = allVisuals().filter((record) => visualMatches(record, query))
  lightboxItems = records
  const groups = ['CHAPTER ART', 'CHARACTERS', 'LOCATIONS']

  content.innerHTML = `
    <section class="archive-visuals-v2">
      <header class="archive-visuals-intro">
        <span>VISUAL ARCHIVE / IMAGE RECORDS</span>
        <h3>OPEN THE FRAME.</h3>
        <p>Chapter artwork, personnel portraits and location records are stored together here. Select any image to inspect the full visual record.</p>
      </header>
      ${records.length ? groups.map((group) => {
        const items = records.filter((record) => record.group === group)
        if (!items.length) return ''
        const slug = group.toLowerCase().replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'')
        return `
          <section class="archive-visual-group archive-visual-group--${slug}">
            <header><span>${group}</span><i>${String(items.length).padStart(2,'0')} RECORDS</i></header>
            <div class="archive-visual-grid-v2">
              ${items.map((record) => {
                const index = records.indexOf(record)
                const portrait = record.group === 'CHARACTERS' ? ' archive-visual-card--portrait' : ''
                return `
                  <button class="archive-visual-card${portrait}" type="button" data-visual-open="${index}" aria-label="Open ${record.title} image">
                    <span class="archive-visual-card__image"><img src="${record.src}" alt="${record.title}" loading="lazy" decoding="async" /></span>
                    <span class="archive-visual-card__shade" aria-hidden="true"></span>
                    <span class="archive-visual-card__copy"><small>${record.meta}</small><strong>${record.title}</strong><i>EXPAND ↗</i></span>
                  </button>
                `
              }).join('')}
            </div>
          </section>
        `
      }).join('') : '<div class="archive-visuals-empty"><span>NO MATCHING IMAGE RECORDS</span></div>'}
    </section>
  `

  const count = root.querySelector('[data-archive-count]')
  if (count) count.textContent = `${records.length} RECORD${records.length === 1 ? '' : 'S'}`
}

const ensureLightbox = () => {
  let box = document.querySelector('[data-archive-lightbox]')
  if (box) return box

  box = document.createElement('div')
  box.className = 'archive-lightbox'
  box.dataset.archiveLightbox = ''
  box.hidden = true
  box.setAttribute('role', 'dialog')
  box.setAttribute('aria-modal', 'true')
  box.setAttribute('aria-labelledby', 'archive-lightbox-title')
  box.innerHTML = `
    <div class="archive-lightbox__backdrop" data-lightbox-close></div>
    <section class="archive-lightbox__panel">
      <button class="archive-lightbox__close" type="button" data-lightbox-close aria-label="Close image">×</button>
      <button class="archive-lightbox__nav archive-lightbox__nav--prev" type="button" data-lightbox-prev aria-label="Previous image">‹</button>
      <div class="archive-lightbox__image"><img src="" alt="" data-lightbox-image /></div>
      <button class="archive-lightbox__nav archive-lightbox__nav--next" type="button" data-lightbox-next aria-label="Next image">›</button>
      <footer class="archive-lightbox__caption"><span data-lightbox-meta></span><h2 id="archive-lightbox-title" data-lightbox-title></h2><small data-lightbox-group></small></footer>
    </section>
  `
  document.body.appendChild(box)
  return box
}

const syncLightbox = () => {
  const box = ensureLightbox()
  const record = lightboxItems[lightboxIndex]
  if (!record) return
  const image = box.querySelector('[data-lightbox-image]')
  const title = box.querySelector('[data-lightbox-title]')
  const meta = box.querySelector('[data-lightbox-meta]')
  const group = box.querySelector('[data-lightbox-group]')
  if (image) { image.src = record.src; image.alt = record.title }
  if (title) title.textContent = record.title
  if (meta) meta.textContent = record.meta
  if (group) group.textContent = `${record.group} / ${String(lightboxIndex + 1).padStart(2,'0')} OF ${String(lightboxItems.length).padStart(2,'0')}`
}

const openLightbox = (index, trigger) => {
  if (!lightboxItems[index]) return
  lightboxIndex = index
  previousFocus = trigger || document.activeElement
  const box = ensureLightbox()
  syncLightbox()
  box.hidden = false
  requestAnimationFrame(() => box.classList.add('is-open'))
  document.body.classList.add('archive-lightbox-open')
  box.querySelector('[data-lightbox-close]')?.focus({ preventScroll:true })
}

const closeLightbox = () => {
  const box = document.querySelector('[data-archive-lightbox]')
  if (!box || box.hidden) return
  box.classList.remove('is-open')
  document.body.classList.remove('archive-lightbox-open')
  window.setTimeout(() => { box.hidden = true }, 220)
  previousFocus?.focus?.({ preventScroll:true })
}

const moveLightbox = (direction) => {
  if (!lightboxItems.length) return
  lightboxIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length
  syncLightbox()
}

const sync = () => {
  if (!root?.children.length) return
  const category = currentCategory()
  if (category === 'characters') enhanceCharacters()
  if (category === 'visuals') renderVisuals()
}

const queue = () => {
  if (queued) return
  queued = true
  requestAnimationFrame(() => { queued = false; sync() })
}

const initialize = () => {
  if (!root) return

  root.addEventListener('click', (event) => {
    const category = event.target.closest('[data-archive-category]')
    if (category) { queue(); return }

    const visual = event.target.closest('[data-visual-open]')
    if (visual) {
      openLightbox(Number(visual.dataset.visualOpen), visual)
      return
    }

    const card = event.target.closest('.archive-character-card[data-flip-ready="1"]')
    if (card && currentCategory() === 'characters') toggleCharacter(card)
  })

  root.addEventListener('keydown', (event) => {
    const card = event.target.closest('.archive-character-card[data-flip-ready="1"]')
    if (!card || !['Enter',' '].includes(event.key)) return
    event.preventDefault()
    toggleCharacter(card)
  })

  root.querySelector('[data-archive-search]')?.addEventListener('input', queue)

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-lightbox-close]')) closeLightbox()
    else if (event.target.closest('[data-lightbox-prev]')) moveLightbox(-1)
    else if (event.target.closest('[data-lightbox-next]')) moveLightbox(1)
  })

  document.addEventListener('keydown', (event) => {
    const box = document.querySelector('[data-archive-lightbox]')
    if (!box || box.hidden) return
    if (event.key === 'Escape') closeLightbox()
    else if (event.key === 'ArrowLeft') moveLightbox(-1)
    else if (event.key === 'ArrowRight') moveLightbox(1)
  })

  const observer = new MutationObserver(queue)
  observer.observe(root, { childList:true, subtree:true })
  window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
  queue()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()