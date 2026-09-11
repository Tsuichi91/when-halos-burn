import './styles/site.css'
import './styles/admin-lyrics-sync.css'
import { chapters, chapterOrder } from './chapter-data.js'
import {
  fetchEmbeddedLyrics,
  lyricsTextToLines,
  getLyricsSyncSlug,
  getLyricsSyncUrl,
  formatSyncTime,
  parseSyncTime
} from './lyrics-sync-utils.js'

const root = document.querySelector('#lyrics-sync-root')
const draftPrefix = 'whb-lyrics-sync-draft-v1:'

let chapter = chapters[chapterOrder[0]]
let lines = []
let selectedIndex = 0
let audio = null
let statusMessage = ''
let deployedState = 'NO DEPLOYED SYNC'
let lastMarkedIndex = null

const escapeHtml = (value) => String(value)
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;')
  .replace(/'/g,'&#039;')

const draftKey = () => `${draftPrefix}${getLyricsSyncSlug(chapter)}`
const syncedCount = () => lines.filter((line) => Number.isFinite(line.time)).length
const isComplete = () => lines.length > 0 && syncedCount() === lines.length && lines.every((line,index) => index === 0 || line.time >= lines[index - 1].time)

const saveDraft = () => {
  try {
    localStorage.setItem(draftKey(), JSON.stringify({
      track:chapter.code,
      lines:lines.map(({time,text,breakBefore}) => ({time,text,breakBefore}))
    }))
  } catch { /* optional */ }
}

const restoreDraft = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(draftKey()) || 'null')
    if (!raw || raw.track !== chapter.code || !Array.isArray(raw.lines) || raw.lines.length !== lines.length) return false
    if (!raw.lines.every((line,index) => line.text === lines[index].text)) return false
    lines = lines.map((line,index) => ({...line,time:Number.isFinite(Number(raw.lines[index].time)) ? Number(raw.lines[index].time) : null}))
    return true
  } catch {
    return false
  }
}

const buildJson = () => ({
  version:1,
  track:chapter.code,
  title:chapter.title,
  source:'embedded-uslt',
  synced:isComplete(),
  updatedAt:new Date().toISOString(),
  lines:lines.map(({time,text,breakBefore}) => ({
    time:Number.isFinite(time) ? Number(time.toFixed(3)) : null,
    text,
    breakBefore:Boolean(breakBefore)
  }))
})

const setStatus = (message) => {
  statusMessage = message
  const node = root.querySelector('[data-admin-message]')
  if (node) node.textContent = message
}

const renderRows = () => {
  const list = root.querySelector('[data-sync-lines]')
  if (!list) return

  list.innerHTML = lines.map((line,index) => `
    <article class="sync-line ${index === selectedIndex ? 'is-selected' : ''} ${Number.isFinite(line.time) ? 'is-marked' : ''}" data-line-row="${index}">
      <button class="sync-line__select" type="button" data-select-line="${index}" aria-label="Select line ${index + 1}">
        <span>${String(index + 1).padStart(3,'0')}</span>
      </button>
      <label class="sync-line__time">
        <span>TIME</span>
        <input type="text" inputmode="decimal" value="${Number.isFinite(line.time) ? formatSyncTime(line.time) : ''}" placeholder="--:--.---" data-time-input="${index}" aria-label="Timestamp for line ${index + 1}" />
      </label>
      <button class="sync-line__text" type="button" data-select-line="${index}">
        ${line.breakBefore ? '<i aria-hidden="true"></i>' : ''}
        <span>${escapeHtml(line.text)}</span>
      </button>
    </article>
  `).join('')

  const selected = list.querySelector(`[data-line-row="${selectedIndex}"]`)
  selected?.scrollIntoView({block:'nearest'})
  refreshSummary()
}

const refreshSummary = () => {
  const count = syncedCount()
  const total = lines.length
  const countNode = root.querySelector('[data-sync-count]')
  const stateNode = root.querySelector('[data-sync-complete]')
  const currentNode = root.querySelector('[data-current-line]')
  const targetNode = root.querySelector('[data-target-path]')

  if (countNode) countNode.textContent = `${count} / ${total}`
  if (stateNode) {
    stateNode.textContent = isComplete() ? 'READY FOR STORY MODE' : 'SYNC IN PROGRESS'
    stateNode.classList.toggle('is-ready', isComplete())
  }
  if (currentNode) currentNode.textContent = lines[selectedIndex]?.text || '—'
  if (targetNode) targetNode.textContent = `public/data/lyrics-sync/${getLyricsSyncSlug(chapter)}.json`
}

const renderShell = () => {
  root.innerHTML = `
    <header class="lyrics-admin__topbar">
      <a href="./story.html#story-hub" class="lyrics-admin__brand">
        <span class="lyrics-admin__mark" aria-hidden="true"></span>
        <span><b>WHEN HALOS BURN</b><small>LYRICS SYNC ADMIN</small></span>
      </a>
      <div class="lyrics-admin__top-status"><span>VESPER / INTERNAL TOOL</span><strong data-sync-complete>SYNC IN PROGRESS</strong></div>
    </header>

    <section class="lyrics-admin__intro">
      <div>
        <span>ADMIN / LYRIC TIMING</span>
        <h1>SYNC<br />CONSOLE</h1>
        <p>Mark the start of each lyric line while the final master plays. Space marks the current line; P toggles playback; U undoes the last mark.</p>
      </div>
      <aside>
        <span>PERMANENT DATA TARGET</span>
        <strong data-target-path></strong>
        <p>The editor only creates the JSON. Once that JSON is placed at this path, Story Mode reads it independently of this admin page.</p>
      </aside>
    </section>

    <section class="lyrics-admin__workspace">
      <aside class="lyrics-admin__controls">
        <label class="admin-field">
          <span>TRACK</span>
          <select data-track-select>
            ${chapterOrder.map((code) => `<option value="${code}">${code} — ${escapeHtml(chapters[code].title)}</option>`).join('')}
          </select>
        </label>

        <div class="admin-track-meta">
          <span data-track-act></span>
          <h2 data-track-title></h2>
          <p data-track-perspective></p>
        </div>

        <audio controls preload="metadata" data-sync-audio></audio>

        <div class="admin-player-readout">
          <span data-audio-current>0:00.000</span>
          <span data-audio-duration>--:--.---</span>
        </div>

        <div class="admin-key-actions">
          <button type="button" data-toggle-play><span>P</span><strong>PLAY / PAUSE</strong></button>
          <button class="is-primary" type="button" data-mark-line><span>SPACE</span><strong>MARK LINE</strong></button>
          <button type="button" data-undo><span>U</span><strong>UNDO MARK</strong></button>
        </div>

        <section class="admin-current">
          <span>CURRENT LINE</span>
          <strong data-current-line>—</strong>
        </section>

        <dl class="admin-stats">
          <div><dt>MARKED</dt><dd data-sync-count>0 / 0</dd></div>
          <div><dt>DEPLOYED</dt><dd data-deployed-state>—</dd></div>
        </dl>

        <div class="admin-file-actions">
          <button type="button" data-download>DOWNLOAD JSON</button>
          <button type="button" data-copy-json>COPY JSON</button>
          <label class="admin-import">IMPORT JSON<input type="file" accept=".json,application/json" data-import /></label>
          <button class="is-danger" type="button" data-reset>RESET TIMESTAMPS</button>
        </div>

        <p class="admin-message" data-admin-message></p>
      </aside>

      <section class="lyrics-admin__lines">
        <header>
          <div><span>LINE TIMELINE</span><strong>Click any line to select it</strong></div>
          <div><span>SHORTCUTS</span><strong>SPACE · MARK / P · PLAY / U · UNDO</strong></div>
        </header>
        <div class="sync-lines" data-sync-lines></div>
      </section>
    </section>
  `

  root.querySelector('[data-track-select]').value = chapter.code
  bindShell()
}

const loadTrack = async (code) => {
  chapter = chapters[code] || chapters[chapterOrder[0]]
  selectedIndex = 0
  lastMarkedIndex = null
  statusMessage = ''
  deployedState = 'NO DEPLOYED SYNC'

  const title = root.querySelector('[data-track-title]')
  const act = root.querySelector('[data-track-act]')
  const perspective = root.querySelector('[data-track-perspective]')
  const deployed = root.querySelector('[data-deployed-state]')

  if (title) title.textContent = chapter.title
  if (act) act.textContent = `${chapter.code} / ${chapter.act}`
  if (perspective) perspective.textContent = `${chapter.perspective} · ${chapter.location}`

  audio = root.querySelector('[data-sync-audio]')
  audio.src = chapter.audio
  audio.load()

  setStatus('Loading embedded master lyrics…')

  try {
    const lyricText = await fetchEmbeddedLyrics(chapter.audio)
    lines = lyricsTextToLines(lyricText)

    try {
      const response = await fetch(getLyricsSyncUrl(chapter), {cache:'no-store'})
      if (response.ok) {
        const deployedJson = await response.json()
        const matching = Array.isArray(deployedJson.lines) &&
          deployedJson.lines.length === lines.length &&
          deployedJson.lines.every((line,index) => line.text === lines[index].text)

        if (matching) {
          lines = lines.map((line,index) => ({
            ...line,
            time:Number.isFinite(Number(deployedJson.lines[index].time)) ? Number(deployedJson.lines[index].time) : null
          }))
          deployedState = deployedJson.synced === true ? 'SYNCED JSON' : 'DRAFT JSON'
        } else {
          deployedState = 'JSON / LYRIC MISMATCH'
        }
      }
    } catch { /* missing sync file is expected */ }

    const restored = restoreDraft()
    selectedIndex = Math.max(0, lines.findIndex((line) => !Number.isFinite(line.time)))
    if (selectedIndex < 0) selectedIndex = lines.length - 1

    if (deployed) deployed.textContent = deployedState
    renderRows()
    setStatus(restored ? 'Local draft restored.' : 'Ready to sync.')
  } catch (error) {
    lines = []
    renderRows()
    setStatus('Could not read embedded lyrics from this MP3.')
  }
}

const markLine = () => {
  if (!audio || !lines[selectedIndex]) return
  const time = Number(audio.currentTime.toFixed(3))
  lines[selectedIndex].time = time
  lastMarkedIndex = selectedIndex

  if (selectedIndex < lines.length - 1) selectedIndex += 1
  saveDraft()
  renderRows()
}

const undoMark = () => {
  let index = lastMarkedIndex
  if (!Number.isInteger(index) || !Number.isFinite(lines[index]?.time)) {
    index = selectedIndex - 1
    while (index >= 0 && !Number.isFinite(lines[index]?.time)) index -= 1
  }
  if (index < 0) return

  const oldTime = lines[index].time
  lines[index].time = null
  selectedIndex = index
  lastMarkedIndex = null
  if (Number.isFinite(oldTime) && audio) audio.currentTime = Math.max(0, oldTime - .35)
  saveDraft()
  renderRows()
}

const togglePlay = async () => {
  if (!audio) return
  if (audio.paused) {
    try { await audio.play() } catch { /* browser may require direct gesture */ }
  } else {
    audio.pause()
  }
}

const importJson = async (file) => {
  if (!file) return
  try {
    const data = JSON.parse(await file.text())
    if (String(data.track || '').toUpperCase() !== chapter.code || !Array.isArray(data.lines)) throw new Error('wrong track')
    if (data.lines.length !== lines.length || !data.lines.every((line,index) => line.text === lines[index].text)) throw new Error('lyrics mismatch')

    lines = lines.map((line,index) => ({
      ...line,
      time:Number.isFinite(Number(data.lines[index].time)) ? Number(data.lines[index].time) : null
    }))
    selectedIndex = Math.max(0, lines.findIndex((line) => !Number.isFinite(line.time)))
    if (selectedIndex < 0) selectedIndex = lines.length - 1
    saveDraft()
    renderRows()
    setStatus('JSON imported.')
  } catch {
    setStatus('Import rejected: track or lyric lines do not match.')
  }
}

const downloadJson = () => {
  const data = buildJson()
  const blob = new Blob([JSON.stringify(data,null,2) + '\n'], {type:'application/json'})
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${getLyricsSyncSlug(chapter)}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  setStatus(data.synced ? 'Complete sync JSON downloaded.' : 'Partial draft JSON downloaded. Story Mode will ignore it until complete.')
}

const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(buildJson(),null,2))
    setStatus('JSON copied to clipboard.')
  } catch {
    setStatus('Clipboard access was blocked by the browser.')
  }
}

const resetTimestamps = () => {
  if (!confirm(`Reset all timestamps for ${chapter.title}?`)) return
  lines = lines.map((line) => ({...line,time:null}))
  selectedIndex = 0
  lastMarkedIndex = null
  try { localStorage.removeItem(draftKey()) } catch { /* optional */ }
  if (audio) audio.currentTime = 0
  renderRows()
  setStatus('Timestamps reset.')
}

const bindShell = () => {
  root.querySelector('[data-track-select]').addEventListener('change',(event) => loadTrack(event.target.value))
  root.querySelector('[data-toggle-play]').addEventListener('click',togglePlay)
  root.querySelector('[data-mark-line]').addEventListener('click',markLine)
  root.querySelector('[data-undo]').addEventListener('click',undoMark)
  root.querySelector('[data-download]').addEventListener('click',downloadJson)
  root.querySelector('[data-copy-json]').addEventListener('click',copyJson)
  root.querySelector('[data-reset]').addEventListener('click',resetTimestamps)
  root.querySelector('[data-import]').addEventListener('change',(event) => importJson(event.target.files?.[0]))

  root.querySelector('[data-sync-lines]').addEventListener('click',(event) => {
    const target = event.target.closest('[data-select-line]')
    if (!target) return
    selectedIndex = Number(target.dataset.selectLine)
    const time = lines[selectedIndex]?.time
    if (Number.isFinite(time) && audio) audio.currentTime = time
    renderRows()
  })

  root.querySelector('[data-sync-lines]').addEventListener('change',(event) => {
    const input = event.target.closest('[data-time-input]')
    if (!input) return
    const index = Number(input.dataset.timeInput)
    const parsed = parseSyncTime(input.value)
    if (parsed === null) lines[index].time = null
    else if (Number.isFinite(parsed) && parsed >= 0) lines[index].time = Number(parsed.toFixed(3))
    else {
      input.value = Number.isFinite(lines[index].time) ? formatSyncTime(lines[index].time) : ''
      setStatus('Timestamp format: seconds or m:ss.xxx')
      return
    }
    saveDraft()
    renderRows()
  })

  audio = root.querySelector('[data-sync-audio]')
  audio.addEventListener('timeupdate',() => {
    const node = root.querySelector('[data-audio-current]')
    if (node) node.textContent = formatSyncTime(audio.currentTime)
  })
  audio.addEventListener('loadedmetadata',() => {
    const node = root.querySelector('[data-audio-duration]')
    if (node) node.textContent = formatSyncTime(audio.duration)
  })
}

document.addEventListener('keydown',(event) => {
  const tag = event.target?.tagName
  const typing = ['INPUT','TEXTAREA','SELECT'].includes(tag) || event.target?.isContentEditable
  if (typing || event.ctrlKey || event.metaKey || event.altKey) return

  if (event.code === 'Space') {
    event.preventDefault()
    markLine()
  } else if (event.key.toLowerCase() === 'p') {
    event.preventDefault()
    togglePlay()
  } else if (event.key.toLowerCase() === 'u') {
    event.preventDefault()
    undoMark()
  }
})

renderShell()
loadTrack(chapter.code)
