import './styles/archive-records.css'
import { getChapterHref } from './chapter-data.js'

const root = document.querySelector('#archive-app')
let recordsActive = false
let previousFocus = null
let selectedRecord = null
let queued = false

const records = [
  {
    id:'REC-001', title:'BLACKOUT INCIDENT REPORT', type:'INCIDENT RECORD', date:'2158 / BLACKOUT NIGHT', source:'HALO COUNCIL', clearance:'PUBLIC / REVISED', status:'CONTRADICTED',
    summary:'The foundational public account of the event that created Vesper’s official Hero and Villain roles.',
    sourceLabel:'OFFICIAL RECORD',
    sourceText:'The Council attributes the citywide failure to an Eclipse attack led by Kang Taeyun, later designated the Architect of the Blackout. Han Seojun is recorded among those lost during the response.',
    finding:'Recovered Core material shows that the Council triggered a controlled broad blackout to isolate Taeyun’s operation and destroy the evidence trail. Council internal forces, not Taeyun, shot Seojun.',
    note:'The reconstructed record does not erase Taeyun’s responsibility. His infiltration contributed to the conditions in which the crisis spread; it contradicts the claim that he caused the blackout alone or killed Seojun.',
    tags:['BLACKOUT','HALO','ECLIPSE','CONTRADICTION'], chapter:'01A'
  },
  {
    id:'REC-002', title:'HAN SEOJUN / MEMORIAL RECORD', type:'PUBLIC MEMORIAL FILE', date:'2158 / AFTERMATH', source:'HALO PUBLIC RECORD', clearance:'PUBLIC', status:'ALTERED',
    summary:'The official record that preserved Seojun as a symbol while removing the discovery that made him dangerous to HALO.',
    sourceLabel:'OFFICIAL RECORD',
    sourceText:'Seojun is memorialized as a HALO-aligned casualty of the Blackout and folded into the civic narrative of service, sacrifice and resistance to Eclipse violence.',
    finding:'Seojun had independently discovered evidence of HALO wrongdoing. During the Blackout, Council internal forces shot him. Before dying, he passed a surviving data fragment to Taeyun and asked that the truth be preserved.',
    note:'The memorial is powerful because parts of it are true: Seojun did act courageously. What was altered was the reason his final actions mattered and who actually killed him.',
    tags:['SEOJUN','MARTYR','WITNESS','ALTERED'], chapter:'09'
  },
  {
    id:'REC-003', title:'KANG TAEYUN / THREAT DOSSIER', type:'SECURITY DOSSIER', date:'2158–2164', source:'HALO SECURITY', clearance:'RESTRICTED', status:'PARTIALLY FALSE',
    summary:'HALO’s operational profile of the man it taught Vesper to know as The Architect.',
    sourceLabel:'OFFICIAL RECORD',
    sourceText:'Taeyun is classified as a high-level Eclipse strategist, saboteur and principal architect of the 2158 Blackout. The file treats his actions as evidence of an escalating threat to civic stability.',
    finding:'Taeyun was a former HALO insider attempting to expose illegal surveillance and political classification. He did not order the Council blackout or kill Seojun, but he knowingly used manipulation and accepted dangerous operational risk in pursuit of the archive.',
    note:'The dossier is not useless simply because its central history is false. Taeyun is genuinely strategic, deceptive and willing to provoke systems and people. The archive separates those facts from the crimes assigned to him for political convenience.',
    tags:['TAEYUN','ARCHITECT','THREAT MODEL','PARTIAL'], chapter:'02'
  },
  {
    id:'REC-004', title:'HAN JIWON / PERSONNEL FILE', type:'PERSONNEL RECORD', date:'2164', source:'HALO GUARD', clearance:'INTERNAL', status:'VERIFIED',
    summary:'An accurate service record embedded inside an institutionally distorted understanding of the Blackout.',
    sourceLabel:'SOURCE RECORD',
    sourceText:'Jiwon is recorded as a 29-year-old elite HALO Guard officer designated AEGIS: disciplined, protective, operationally precise and trusted within the security structure.',
    finding:'The personnel data is internally consistent. The distortion is contextual: the file inherits HALO’s false Blackout narrative, including the official meaning of Seojun’s death and Taeyun’s designation as the enemy responsible for it.',
    note:'This record demonstrates a recurring archive problem: a document can contain accurate facts and still produce a false conclusion because the system around those facts has already decided what they mean.',
    tags:['JIWON','AEGIS','HALO GUARD','VERIFIED'], chapter:'03'
  },
  {
    id:'REC-005', title:'YOON MIRAE / DETENTION RECORD', type:'SEALED INTERNAL FILE', date:'2158 / PRE-BLACKOUT', source:'COUNCIL INTERNAL', clearance:'SEALED', status:'RECOVERED',
    summary:'A suppressed record connecting Taeyun’s failed internal exposure attempt to the disappearance of his mentor.',
    sourceLabel:'OFFICIAL RECORD',
    sourceText:'No complete public detention record for Yoon Mirae survives in the accessible HALO archive. Her disappearance is absent from the narrative later used to explain Taeyun’s break with the institution.',
    finding:'Recovered internal material confirms that Mirae helped Taeyun preserve evidence of illegal HALO surveillance and political classification. She was detained, and her death was subsequently concealed.',
    note:'The recovered record establishes motive and institutional suppression without turning Mirae into a plot device: her absence is one of the reasons Taeyun stopped believing that internal procedure could expose the system safely.',
    tags:['MIRAE','DETENTION','SUPPRESSION','RECOVERED']
  },
  {
    id:'REC-006', title:'HALO CORE / ACCESS LOG', type:'SYSTEM ACCESS RECORD', date:'2158 / 2164', source:'HALO CORE', clearance:'CORE / RESTRICTED', status:'SEALED → VERIFIED',
    summary:'A system-level trail linking the Blackout response, concealed evidence and the archive released six years later.',
    sourceLabel:'SYSTEM RECORD',
    sourceText:'Large sections of the 2158 emergency access sequence were sealed or made unavailable after the grid event. The public record therefore treats the Core as a protected system targeted by Eclipse.',
    finding:'The reconstructed sequence places the complete contradictory Blackout archive inside the Core and links the Council response to deliberate isolation of Taeyun’s infiltration. In 2164, the same archive becomes the evidence capable of collapsing the official narrative.',
    note:'The Core matters because HALO preserved the truth while denying public access to it. The system did not lack evidence; access to evidence was controlled.',
    tags:['HALO CORE','ACCESS','SEALED','VERIFIED'], chapter:'12'
  },
  {
    id:'REC-007', title:'JIWON PROFILE / ECLIPSE DOSSIER', type:'PRIVATE OPERATION FILE', date:'~6 MONTHS BEFORE FIRST CONTACT', source:'KANG TAEYUN / ECLIPSE', clearance:'PRIVATE / RECOVERED', status:'RECOVERED',
    summary:'The original operational plan that turns the later relationship into a question of informed choice.',
    sourceLabel:'ECLIPSE SOURCE',
    sourceText:'Observe Jiwon. Profile his behavior. Engineer contact. Destabilize trust in the Council. Gain a route to biometric access. Retrieve the sealed archive. Taeyun already knows Jiwon is Han Seojun’s brother.',
    finding:'The dossier confirms that Jiwon entered Taeyun’s life as part of a plan rather than by accident. It also becomes increasingly poor at predicting Taeyun’s later choices as fascination, restraint and genuine attachment begin overriding the original objective.',
    note:'This is the record at the center of FAULT LINE. The betrayal is not that the HALO evidence is false; it is that Jiwon was denied the information required to choose the relationship with full knowledge of how it began.',
    tags:['JIWON','TAEYUN','THE PLAN','BETRAYAL'], chapter:'09'
  },
  {
    id:'REC-008', title:'SEOJUN DATA FRAGMENT', type:'RECOVERED DATA', date:'2158 / BLACKOUT NIGHT', source:'HAN SEOJUN', clearance:'PARTIAL / HIGH VALUE', status:'PARTIAL',
    summary:'The surviving fragment Seojun placed in Taeyun’s hands before his death.',
    sourceLabel:'RECOVERED FRAGMENT',
    sourceText:'The surviving data links Seojun to evidence of HALO surveillance and political classification that contradicts the institution’s public purpose and later Blackout narrative.',
    finding:'The fragment independently corroborates the same wrongdoing Taeyun and Mirae had been trying to expose. On its own it does not reconstruct the entire Blackout; its importance is that it connects Seojun directly to the hidden evidence and survives the attempt to erase that connection.',
    note:'A partial record is not a complete answer. Its value comes from corroboration: separate people reached the same institutional truth from different directions.',
    tags:['SEOJUN','DATA FRAGMENT','CORROBORATION','PARTIAL'], chapter:'10'
  },
  {
    id:'REC-009', title:'ARCHIVE RELEASE LOG / 2164', type:'CORE RELEASE EVENT', date:'2164 / HALO CORE', source:'VESPER ARCHIVE', clearance:'PUBLIC AFTER RELEASE', status:'VERIFIED',
    summary:'The event record marking the moment the sealed archive stops belonging exclusively to the institution that hid it.',
    sourceLabel:'EVENT RECORD',
    sourceText:'The complete Blackout archive is accessed and released from the HALO Core after Jiwon independently verifies the evidence and reaches the sealed record on his own terms.',
    finding:'The release exposes the controlled blackout, the concealed institutional wrongdoing and the false narrative surrounding Seojun and Taeyun. It does not instantly repair Vesper or erase the consequences of anyone’s choices.',
    note:'The political climax and the relationship resolve around the same principle: truth matters, but agency cannot be sacrificed in the name of delivering it.',
    tags:['RELEASE','TRUTH','AGENCY','2164'], chapter:'12'
  },
  {
    id:'REC-010', title:'VESPER PUBLIC BULLETIN / AFTERLIGHT', type:'POST-RELEASE RECORD', date:'2164 / AFTERLIGHT', source:'CIVIC NETWORK', clearance:'PUBLIC', status:'POST-RELEASE',
    summary:'A record of a city that has received the truth before it has figured out what to do with it.',
    sourceLabel:'PUBLIC RECORD',
    sourceText:'The release of previously sealed HALO material has broken the information monopoly that sustained the official Blackout account. The old version of events can no longer function as uncontested civic fact.',
    finding:'The archive records no instant repair. Vesper remains politically and emotionally unsettled, while Jiwon and Taeyun step outside the fixed Hero and Villain roles that once organized the story around them.',
    note:'AFTERLIGHT is not a victory report. It is the first record made after certainty loses its authority — morning rather than closure.',
    tags:['AFTERLIGHT','VESPER','PUBLIC','HORIZON'], chapter:'13'
  }
]

const currentCategory = () => root?.querySelector('[data-archive-category].is-active')?.dataset.archiveCategory || ''
const searchInput = () => root?.querySelector('[data-archive-search]')

const escapeHtml = (value='') => String(value)
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;')

const filteredRecords = () => {
  const query = searchInput()?.value.trim().toLowerCase() || ''
  if (!query) return records
  return records.filter((record) => [record.id,record.title,record.type,record.date,record.source,record.clearance,record.status,record.summary,record.tags.join(' ')].join(' ').toLowerCase().includes(query))
}

const renderRecords = () => {
  if (!root || currentCategory() !== 'records') return
  const target = root.querySelector('[data-archive-content]')
  const title = root.querySelector('[data-archive-title]')
  const count = root.querySelector('[data-archive-count]')
  if (!target) return

  const items = filteredRecords()
  if (title) title.textContent = 'RECORDS'
  if (count) count.textContent = `${items.length} RECORD${items.length === 1 ? '' : 'S'}`

  target.innerHTML = `
    <section class="archive-documents">
      <header class="archive-documents__intro">
        <span>DOCUMENT ARCHIVE / EVIDENCE + SOURCE FILES</span>
        <h3>READ THE RECORD AGAIN.</h3>
        <p>These are the files Vesper used to define what happened — and the recovered evidence that changes what those files mean. A record can contain facts without containing the truth.</p>
      </header>
      <div class="archive-documents__legend" aria-label="Record status legend">
        <span>TRUST STATE</span><i>VERIFIED</i><i>RECOVERED</i><i>PARTIAL</i><i>ALTERED</i><i>CONTRADICTED</i>
      </div>
      ${items.length ? `<div class="archive-document-grid">
        ${items.map((record) => `
          <button class="archive-document-card" type="button" data-document-id="${record.id}" aria-label="Open ${escapeHtml(record.title)}">
            <span class="archive-document-card__top"><i>${record.id}</i><strong>${record.status}</strong></span>
            <span class="archive-document-card__type">${record.type}</span>
            <span class="archive-document-card__title">${record.title}</span>
            <span class="archive-document-card__summary">${record.summary}</span>
            <span class="archive-document-card__meta"><i><b>DATE</b>${record.date}</i><i><b>SOURCE</b>${record.source}</i><i><b>CLEARANCE</b>${record.clearance}</i></span>
            <span class="archive-document-card__tags">${record.tags.map((tag) => `<i>${tag}</i>`).join('')}</span>
            <span class="archive-document-card__open">OPEN RECORD ↗</span>
          </button>
        `).join('')}
      </div>` : `<div class="archive-documents__empty"><span>NO MATCHING DOCUMENT RECORDS</span></div>`}
    </section>
  `
}

const ensureOverlay = () => {
  let overlay = document.querySelector('[data-document-overlay]')
  if (overlay) return overlay

  overlay = document.createElement('div')
  overlay.className = 'archive-document-overlay'
  overlay.dataset.documentOverlay = ''
  overlay.hidden = true
  overlay.setAttribute('role','dialog')
  overlay.setAttribute('aria-modal','true')
  overlay.setAttribute('aria-labelledby','archive-document-title')
  overlay.innerHTML = `
    <div class="archive-document-overlay__backdrop" data-document-close></div>
    <article class="archive-document-sheet">
      <button class="archive-document-sheet__close" type="button" data-document-close aria-label="Close record">×</button>
      <header class="archive-document-sheet__header">
        <div><span data-doc-id></span><i>VESPER ARCHIVE / DOCUMENT RECORD</i></div>
        <strong data-doc-status></strong>
      </header>
      <section class="archive-document-sheet__identity">
        <span data-doc-type></span>
        <h2 id="archive-document-title" data-doc-title></h2>
      </section>
      <dl class="archive-document-sheet__meta">
        <div><dt>DATE</dt><dd data-doc-date></dd></div>
        <div><dt>SOURCE</dt><dd data-doc-source></dd></div>
        <div><dt>CLEARANCE</dt><dd data-doc-clearance></dd></div>
        <div><dt>TRUST STATE</dt><dd data-doc-state></dd></div>
      </dl>
      <div class="archive-document-sheet__redactions" aria-hidden="true"><i></i><i></i><i></i></div>
      <section class="archive-document-sheet__comparison">
        <article><span data-doc-source-label>SOURCE RECORD</span><p data-doc-source-text></p></article>
        <article><span>ARCHIVE FINDING</span><p data-doc-finding></p></article>
      </section>
      <section class="archive-document-sheet__note"><span>RECONSTRUCTION NOTE</span><p data-doc-note></p></section>
      <footer class="archive-document-sheet__footer">
        <div data-doc-tags></div>
        <a data-doc-chapter hidden>OPEN RELATED CHAPTER ›</a>
      </footer>
    </article>
  `
  document.body.appendChild(overlay)
  return overlay
}

const openRecord = (record, trigger) => {
  if (!record) return
  selectedRecord = record
  previousFocus = trigger || document.activeElement
  const overlay = ensureOverlay()
  const set = (selector, value) => { const node = overlay.querySelector(selector); if (node) node.textContent = value }
  set('[data-doc-id]', record.id)
  set('[data-doc-status]', record.status)
  set('[data-doc-type]', record.type)
  set('[data-doc-title]', record.title)
  set('[data-doc-date]', record.date)
  set('[data-doc-source]', record.source)
  set('[data-doc-clearance]', record.clearance)
  set('[data-doc-state]', record.status)
  set('[data-doc-source-label]', record.sourceLabel)
  set('[data-doc-source-text]', record.sourceText)
  set('[data-doc-finding]', record.finding)
  set('[data-doc-note]', record.note)
  const tags = overlay.querySelector('[data-doc-tags]')
  if (tags) tags.innerHTML = record.tags.map((tag) => `<i>${tag}</i>`).join('')
  const chapter = overlay.querySelector('[data-doc-chapter]')
  if (chapter) {
    if (record.chapter) { chapter.href = getChapterHref(record.chapter); chapter.hidden = false }
    else { chapter.removeAttribute('href'); chapter.hidden = true }
  }
  overlay.hidden = false
  requestAnimationFrame(() => overlay.classList.add('is-open'))
  document.body.classList.add('archive-document-open')
  overlay.querySelector('[data-document-close]')?.focus({ preventScroll:true })
}

const closeRecord = () => {
  const overlay = document.querySelector('[data-document-overlay]')
  if (!overlay || overlay.hidden) return
  overlay.classList.remove('is-open')
  document.body.classList.remove('archive-document-open')
  window.setTimeout(() => { overlay.hidden = true }, 220)
  previousFocus?.focus?.({ preventScroll:true })
  selectedRecord = null
}

const activateRecords = () => {
  const button = root?.querySelector('[data-archive-category="records"]')
  if (!button) return
  recordsActive = true
  root.querySelectorAll('[data-archive-category]').forEach((item) => item.classList.toggle('is-active', item === button))
  const input = searchInput()
  if (input) {
    input.value = ''
    input.placeholder = 'Search document, source, status…'
  }
  renderRecords()
  if (window.innerWidth < 760) root.querySelector('.archive-main')?.scrollIntoView({ behavior:'smooth', block:'start' })
}

const leaveRecords = () => {
  if (!recordsActive) return
  recordsActive = false
  closeRecord()
  const input = searchInput()
  if (input) {
    input.value = ''
    input.placeholder = 'Search title, POV, act…'
    requestAnimationFrame(() => input.dispatchEvent(new Event('input', { bubbles:true })))
  }
}

const ensureIndex = () => {
  if (!root?.children.length) return
  const nav = root.querySelector('.archive-sidebar nav')
  if (!nav) return

  const setIndex = (key, index, label) => {
    const button = nav.querySelector(`[data-archive-category="${key}"]`)
    if (!button) return null
    const span = button.querySelector('span')
    if (span) span.textContent = index
    if (label) {
      [...button.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => node.remove())
      button.append(document.createTextNode(label))
    }
    return button
  }

  setIndex('chapters','01')
  setIndex('characters','02')
  const locations = setIndex('locations','03')

  let recordsButton = nav.querySelector('[data-archive-category="records"]')
  if (!recordsButton) {
    recordsButton = document.createElement('button')
    recordsButton.type = 'button'
    recordsButton.dataset.archiveCategory = 'records'
    recordsButton.innerHTML = '<span>04</span>RECORDS'
    locations?.after(recordsButton)
  }

  setIndex('music','05')
  setIndex('visuals','06')
  setIndex('notes','07','ANNOTATIONS')
  setIndex('timeline','08')

  if (recordsButton.dataset.recordsBound !== '1') {
    recordsButton.dataset.recordsBound = '1'
    recordsButton.addEventListener('click', activateRecords)
  }
}

const queue = () => {
  if (queued) return
  queued = true
  requestAnimationFrame(() => {
    queued = false
    ensureIndex()
    if (currentCategory() === 'records') renderRecords()
  })
}

const initialize = () => {
  if (!root) return
  ensureIndex()

  root.addEventListener('click', (event) => {
    const category = event.target.closest('[data-archive-category]')
    if (category && category.dataset.archiveCategory !== 'records') {
      leaveRecords()
      return
    }

    const card = event.target.closest('[data-document-id]')
    if (card && currentCategory() === 'records') {
      const record = records.find((item) => item.id === card.dataset.documentId)
      openRecord(record, card)
    }
  })

  root.addEventListener('input', (event) => {
    if (event.target !== searchInput() || currentCategory() !== 'records') return
    event.stopImmediatePropagation()
    renderRecords()
  }, true)

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-document-close]')) closeRecord()
  })

  document.addEventListener('keydown', (event) => {
    const overlay = document.querySelector('[data-document-overlay]')
    if (!overlay || overlay.hidden) return
    if (event.key === 'Escape') closeRecord()
  })

  const observer = new MutationObserver(queue)
  observer.observe(root, { childList:true, subtree:true })
  window.addEventListener('pagehide', () => observer.disconnect(), { once:true })
  window.addEventListener('pageshow', queue)
  queue()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
