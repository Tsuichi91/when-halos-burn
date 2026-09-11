import './styles/site.css'
import './styles/chapter-detail.css'
import './styles/chapter-player.css'
import './styles/chapter-lyrics.css'
import './styles/chapter-sequence.css'
import { chapters, chapterOrder, getChapterHref } from './chapter-data.js'
import { getLyricsSyncUrl, isCompleteLyricsSync } from './lyrics-sync-utils.js'

const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'

const getStoredSet = (key) => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(raw) ? raw : [])
  } catch {
    return new Set()
  }
}

const saveSet = (key, set) => {
  try { window.localStorage.setItem(key, JSON.stringify([...set])) } catch { /* storage optional */ }
}

const completed = getStoredSet(completionStorageKey)
const started = getStoredSet(startedStorageKey)
const params = new URLSearchParams(window.location.search)
const requestedCode = (params.get('chapter') || '01A').toUpperCase()
const chapter = chapters[requestedCode] || chapters['01A']
const index = chapterOrder.indexOf(chapter.code)
const previousCode = index > 0 ? chapterOrder[index - 1] : null
const nextCode = index < chapterOrder.length - 1 ? chapterOrder[index + 1] : null
const root = document.querySelector('#chapter-root')

document.title = `${chapter.title} — WHEN HALOS BURN`

const getStatus = () => completed.has(chapter.code) ? 'COMPLETE' : started.has(chapter.code) ? 'IN PROGRESS' : 'NOT STARTED'

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60)
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}


const readUInt32BE = (bytes, offset) => (
  ((bytes[offset] << 24) >>> 0) +
  (bytes[offset + 1] << 16) +
  (bytes[offset + 2] << 8) +
  bytes[offset + 3]
)

const findAscii = (bytes, value) => {
  const target = [...value].map((character) => character.charCodeAt(0))
  outer: for (let index = 0; index <= bytes.length - target.length; index += 1) {
    for (let offset = 0; offset < target.length; offset += 1) {
      if (bytes[index + offset] !== target[offset]) continue outer
    }
    return index
  }
  return -1
}

const findEncodedTerminator = (bytes, start, encoding) => {
  if (encoding === 1 || encoding === 2) {
    for (let index = start; index + 1 < bytes.length; index += 2) {
      if (bytes[index] === 0 && bytes[index + 1] === 0) return index
    }
    return -1
  }
  return bytes.indexOf(0, start)
}

const decodeId3Text = (bytes, encoding) => {
  if (!bytes?.length) return ''
  const labels = { 0:'windows-1252', 1:'utf-16', 2:'utf-16be', 3:'utf-8' }
  try {
    return new TextDecoder(labels[encoding] || 'utf-8').decode(bytes).replace(/^\uFEFF/, '')
  } catch {
    return new TextDecoder('utf-8').decode(bytes).replace(/^\uFEFF/, '')
  }
}

const extractUsltLyrics = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer)
  const frame = findAscii(bytes, 'USLT')
  if (frame < 0 || frame + 10 >= bytes.length) return ''

  const size = readUInt32BE(bytes, frame + 4)
  const payloadStart = frame + 10
  const payloadEnd = Math.min(payloadStart + size, bytes.length)
  const payload = bytes.slice(payloadStart, payloadEnd)
  if (payload.length < 5) return ''

  const encoding = payload[0]
  const descriptorStart = 4
  const terminator = findEncodedTerminator(payload, descriptorStart, encoding)
  if (terminator < 0) return ''

  const lyricStart = terminator + ((encoding === 1 || encoding === 2) ? 2 : 1)
  return decodeId3Text(payload.slice(lyricStart), encoding).replace(/\u0000+$/g, '')
}

const cleanEmbeddedLyrics = (text) => {
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n')
  const cleaned = lines.map((line) => /^\s*\[[^\]]*\]\s*$/.test(line) ? '' : line.trimEnd())
  return cleaned.join('\n').replace(/\n\s*\n(?:\s*\n)+/g, '\n\n').trim()
}

const escapeLyricsHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const renderLyricsMarkup = (text) => text
  .split(/\n\s*\n/)
  .map((stanza) => stanza.trim())
  .filter(Boolean)
  .map((stanza) => `<p class="chapter-lyrics__stanza">${escapeLyricsHtml(stanza).replace(/\n/g, '<br />')}</p>`)
  .join('')

const renderSyncedLyricsMarkup = (lines) => {
  let markup = ''
  let openStanza = false

  lines.forEach((line, index) => {
    if (!openStanza || line.breakBefore) {
      if (openStanza) markup += '</p>'
      markup += '<p class="chapter-lyrics__stanza chapter-lyrics__stanza--synced">'
      openStanza = true
    }
    markup += `<span class="chapter-lyrics__line" data-lyric-index="${index}">${escapeLyricsHtml(line.text)}</span>`
  })

  if (openStanza) markup += '</p>'
  return markup
}

const fetchEmbeddedLyrics = async (url) => {
  const read = async (range) => {
    const response = await fetch(url, { headers: range ? { Range: range } : undefined })
    if (!response.ok) throw new Error(`Lyrics request failed: ${response.status}`)
    return response.arrayBuffer()
  }

  let buffer = await read('bytes=0-131071')
  let lyrics = extractUsltLyrics(buffer)

  if (!lyrics) {
    buffer = await read(null)
    lyrics = extractUsltLyrics(buffer)
  }

  return cleanEmbeddedLyrics(lyrics)
}

const sceneCards = chapter.scenes.map(([number, label, copy]) => `
  <article class="chapter-scenes__card">
    <span>${number}</span>
    <div><small>${label}</small><p>${copy}</p></div>
  </article>
`).join('')

const notes = chapter.notes.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')
const commandLabel = completed.has(chapter.code) ? 'REPLAY CHAPTER' : started.has(chapter.code) ? 'CONTINUE CHAPTER' : 'START CHAPTER'

root.innerHTML = `
  <header class="chapter-topbar">
    <a class="chapter-topbar__identity" href="./index.html" aria-label="WHEN HALOS BURN home">
      <span class="chapter-topbar__mark" aria-hidden="true"></span>
      <span><b>A CINEMATIC</b><b>CONCEPT ALBUM</b></span>
    </a>
    <nav class="chapter-topbar__nav" aria-label="Chapter navigation">
      <a href="./index.html">HOME</a>
      <a class="is-active" href="./story.html#story-hub">STORY MODE</a>
      <a href="./archive.html">ARCHIVE MODE</a>
      <a href="./story.html?world=1#vesper">WORLD</a>
      <span aria-disabled="true">EXTRAS</span>
    </nav>
    <div class="chapter-topbar__city"><span>VESPER CITY</span><span>2164</span><i aria-hidden="true"></i></div>
  </header>

  <section class="chapter-hero">
    <div class="chapter-hero__art" aria-hidden="true"><img src="${chapter.image}" alt="" /></div>
    <div class="chapter-hero__shade" aria-hidden="true"></div>
    <div class="chapter-hero__grid" aria-hidden="true"></div>
    <a class="chapter-hero__back" href="./story.html#story-hub">← BACK TO STORY MODE</a>
    <div class="chapter-hero__copy">
      <span class="chapter-hero__number">${chapter.display}</span>
      <div class="chapter-hero__title">
        <p>${chapter.act} / STORY CHAPTER</p>
        <h1>${chapter.titleLines.map((line) => `<span>${line}</span>`).join('')}</h1>
        <strong>${chapter.summary}</strong>
      </div>
    </div>
    <div class="chapter-hero__edge" aria-hidden="true"><span>${chapter.perspective}</span><i></i><span>${chapter.code}</span></div>
  </section>

  <section class="chapter-command">
    <dl class="chapter-command__meta">
      <div><dt>PERSPECTIVE</dt><dd>${chapter.perspective}</dd></div>
      <div><dt>LOCATION</dt><dd>${chapter.location}</dd></div>
      <div><dt>DURATION</dt><dd data-duration>--:--</dd></div>
      <div><dt>STATUS</dt><dd data-chapter-status>${getStatus()}</dd></div>
    </dl>

    <button class="chapter-command__start" type="button" data-start-chapter>
      <span data-command-icon>▶</span><strong data-command-label>${commandLabel}</strong><i>›</i>
    </button>

    <div class="chapter-player" data-chapter-player>
      <button class="chapter-player__play" type="button" data-player-play aria-label="Play ${chapter.title}">▶</button>
      <div class="chapter-player__main">
        <div class="chapter-player__head">
          <div><span>${chapter.code} / FINAL MASTER</span><strong>${chapter.title}</strong></div>
          <span data-player-state>MASTER / READY</span>
        </div>
        <input class="chapter-player__seek" type="range" min="0" max="1000" value="0" step="1" data-player-seek aria-label="Seek through ${chapter.title}" />
        <div class="chapter-player__times"><span data-player-current>0:00</span><span data-player-duration>--:--</span></div>
      </div>
      <audio data-player-audio preload="metadata" src="${chapter.audio}"></audio>
    </div>
  </section>

  <section class="chapter-content">
    <nav class="chapter-tabs" role="tablist" aria-label="Chapter information">
      <button class="is-active" type="button" role="tab" aria-selected="true" data-tab="overview">OVERVIEW</button>
      <button type="button" role="tab" aria-selected="false" data-tab="scenes">SCENES</button>
      <button type="button" role="tab" aria-selected="false" data-tab="lyrics">LYRICS</button>
      <button type="button" role="tab" aria-selected="false" data-tab="visuals">VISUALS</button>
      <button type="button" role="tab" aria-selected="false" data-tab="notes">NOTES</button>
    </nav>

    <div class="chapter-panels">
      <section class="chapter-panel is-active" role="tabpanel" data-panel="overview">
        <div class="chapter-overview__copy">
          <p class="chapter-panel__eyebrow">CHAPTER OVERVIEW</p>
          <h2>${chapter.title}</h2>
          <p>${chapter.overview}</p>
        </div>
        <aside class="chapter-overview__question"><span>CORE QUESTION</span><strong>${chapter.question}</strong></aside>
        <blockquote><span>KEY LINE</span>“${chapter.quote}”</blockquote>
      </section>

      <section class="chapter-panel" role="tabpanel" data-panel="scenes" hidden>
        <p class="chapter-panel__eyebrow">SCENE SEQUENCE</p><h2>STORY BEATS</h2>
        <div class="chapter-scenes">${sceneCards}</div>
      </section>

      <section class="chapter-panel chapter-panel--lyrics" role="tabpanel" data-panel="lyrics" hidden>
        <header class="chapter-lyrics__head">
          <div>
            <p class="chapter-panel__eyebrow">FINAL MASTER LYRIC</p>
            <h2>${chapter.title}</h2>
          </div>
          <span data-lyrics-sync-state>${chapter.code} / EMBEDDED LYRIC MASTER</span>
        </header>
        <div class="chapter-lyrics" data-lyrics-body aria-live="polite">
          <p class="chapter-lyrics__loading">LOADING LYRIC MASTER…</p>
        </div>
      </section>

      <section class="chapter-panel" role="tabpanel" data-panel="visuals" hidden>
        <p class="chapter-panel__eyebrow">VISUAL RECORD</p><h2>${chapter.visualLabel}</h2>
        <figure class="chapter-visual"><img src="${chapter.image}" alt="${chapter.title} visual" /><figcaption>${chapter.visualNote}</figcaption></figure>
      </section>

      <section class="chapter-panel" role="tabpanel" data-panel="notes" hidden>
        <p class="chapter-panel__eyebrow">STORY DATA</p><h2>CHAPTER NOTES</h2><dl class="chapter-notes">${notes}</dl>
      </section>
    </div>

    <nav class="chapter-sequence" aria-label="Chapter sequence">
      ${previousCode ? `<a class="chapter-sequence__prev" href="${getChapterHref(previousCode)}"><span>← PREVIOUS</span><strong>${chapters[previousCode].display} / ${chapters[previousCode].title}</strong></a>` : '<span class="chapter-sequence__empty"></span>'}
      <div><small>STORY PROGRESS</small><strong>${chapter.display} / 15</strong></div>
      ${nextCode ? `<a class="chapter-sequence__next" href="${getChapterHref(nextCode)}"><span>NEXT →</span><strong>${chapters[nextCode].display} / ${chapters[nextCode].title}</strong></a>` : `<a class="chapter-sequence__next" href="./story.html#story-hub"><span>RETURN →</span><strong>STORY MODE</strong></a>`}
    </nav>
  </section>

  <nav class="chapter-mobile-dock" aria-label="Mobile navigation">
    <a href="./index.html"><i>⌂</i><span>HOME</span></a>
    <a class="is-active" href="./story.html#story-hub"><i>▣</i><span>STORY</span></a>
    <a href="./archive.html"><i>▤</i><span>ARCHIVE</span></a>
    <a href="./story.html?world=1#vesper"><i>◎</i><span>WORLD</span></a>
    <span aria-disabled="true"><i>◇</i><span>EXTRAS</span></span>
  </nav>
`

const tabs = [...root.querySelectorAll('[data-tab]')]
const panels = [...root.querySelectorAll('[data-panel]')]
tabs.forEach((tab) => tab.addEventListener('click', () => {
  const key = tab.dataset.tab
  tabs.forEach((item) => {
    const active = item === tab
    item.classList.toggle('is-active', active)
    item.setAttribute('aria-selected', String(active))
  })
  panels.forEach((panel) => {
    const active = panel.dataset.panel === key
    panel.classList.toggle('is-active', active)
    panel.hidden = !active
  })
  if (key === 'lyrics') loadLyrics()
}))

const statusEl = root.querySelector('[data-chapter-status]')
const durationEl = root.querySelector('[data-duration]')
const command = root.querySelector('[data-start-chapter]')
const commandLabelEl = root.querySelector('[data-command-label]')
const commandIcon = root.querySelector('[data-command-icon]')
const playButton = root.querySelector('[data-player-play]')
const seek = root.querySelector('[data-player-seek]')
const currentEl = root.querySelector('[data-player-current]')
const playerDurationEl = root.querySelector('[data-player-duration]')
const playerState = root.querySelector('[data-player-state]')
const audio = root.querySelector('[data-player-audio]')
const lyricsBody = root.querySelector('[data-lyrics-body]')
const lyricsSyncState = root.querySelector('[data-lyrics-sync-state]')
let lyricsPromise = null
let syncedLyrics = []
let activeLyricIndex = -1

const loadLyrics = () => {
  if (!lyricsBody || lyricsBody.dataset.loaded === 'true') return Promise.resolve()
  if (lyricsPromise) return lyricsPromise

  lyricsPromise = (async () => {
    let syncData = null
    try {
      const syncResponse = await fetch(getLyricsSyncUrl(chapter), { cache:'no-store' })
      if (syncResponse.ok) syncData = await syncResponse.json()
    } catch { /* unsynced fallback */ }

    if (isCompleteLyricsSync(syncData, chapter.code)) {
      syncedLyrics = syncData.lines.map((line) => ({
        time: Number(line.time),
        text: String(line.text || ''),
        breakBefore: Boolean(line.breakBefore)
      }))
      lyricsBody.innerHTML = renderSyncedLyricsMarkup(syncedLyrics)
      lyricsBody.dataset.loaded = 'true'
      lyricsBody.dataset.synced = 'true'
      if (lyricsSyncState) lyricsSyncState.textContent = `${chapter.code} / SYNCED LYRIC MASTER`
      refreshSyncedLyrics()
      return
    }

    const lyrics = await fetchEmbeddedLyrics(chapter.audio)
    if (!lyrics) throw new Error('No embedded USLT lyrics found')
    syncedLyrics = []
    activeLyricIndex = -1
    lyricsBody.innerHTML = renderLyricsMarkup(lyrics)
    lyricsBody.dataset.loaded = 'true'
    lyricsBody.dataset.synced = 'false'
    if (lyricsSyncState) lyricsSyncState.textContent = `${chapter.code} / EMBEDDED LYRIC MASTER`
  })()
    .catch(() => {
      lyricsBody.innerHTML = '<p class="chapter-lyrics__error">LYRIC MASTER COULD NOT BE LOADED.</p>'
      lyricsBody.dataset.loaded = 'error'
      syncedLyrics = []
      activeLyricIndex = -1
    })
    .finally(() => { lyricsPromise = null })

  return lyricsPromise
}

const refreshStatus = () => { if (statusEl) statusEl.textContent = getStatus() }
const markStarted = () => {
  if (!started.has(chapter.code) && !completed.has(chapter.code)) {
    started.add(chapter.code); saveSet(startedStorageKey, started); refreshStatus()
  }
}
const markComplete = () => {
  completed.add(chapter.code); started.delete(chapter.code)
  saveSet(completionStorageKey, completed); saveSet(startedStorageKey, started); refreshStatus(); refreshCommand()
}
const refreshCommand = () => {
  if (!commandLabelEl || !commandIcon || !audio) return
  if (!audio.paused) { commandLabelEl.textContent = 'PAUSE CHAPTER'; commandIcon.textContent = 'Ⅱ'; return }
  commandIcon.textContent = '▶'
  commandLabelEl.textContent = completed.has(chapter.code) ? 'REPLAY CHAPTER' : started.has(chapter.code) ? 'CONTINUE CHAPTER' : 'START CHAPTER'
}
const refreshSyncedLyrics = () => {
  if (!audio || !syncedLyrics.length || !lyricsBody) return

  let nextIndex = -1
  for (let index = 0; index < syncedLyrics.length; index += 1) {
    if (audio.currentTime + .025 >= syncedLyrics[index].time) nextIndex = index
    else break
  }

  if (nextIndex === activeLyricIndex) return
  activeLyricIndex = nextIndex

  lyricsBody.querySelectorAll('[data-lyric-index]').forEach((line) => {
    const index = Number(line.dataset.lyricIndex)
    const current = index === activeLyricIndex
    line.classList.toggle('is-current', current)
    line.classList.toggle('is-past', index < activeLyricIndex)
    if (current) line.setAttribute('aria-current', 'true')
    else line.removeAttribute('aria-current')
  })
}

const refreshPlayer = () => {
  if (!audio || !seek) return
  const duration = audio.duration
  if (Number.isFinite(duration) && duration > 0) seek.value = String(Math.round((audio.currentTime / duration) * 1000))
  if (currentEl) currentEl.textContent = formatDuration(audio.currentTime)
  refreshSyncedLyrics()
}

const togglePlayback = async () => {
  if (!audio) return
  if (!audio.paused) { audio.pause(); return }
  if (completed.has(chapter.code) && Number.isFinite(audio.duration) && audio.currentTime >= audio.duration - .25) audio.currentTime = 0
  markStarted()
  try { await audio.play() } catch { if (playerState) playerState.textContent = 'MASTER / READY' }
}

command?.addEventListener('click', togglePlayback)
playButton?.addEventListener('click', togglePlayback)
seek?.addEventListener('input', () => {
  if (!audio || !Number.isFinite(audio.duration)) return
  audio.currentTime = (Number(seek.value) / 1000) * audio.duration
  markStarted(); refreshPlayer()
})

audio?.addEventListener('loadedmetadata', () => {
  const formatted = formatDuration(audio.duration)
  if (durationEl) durationEl.textContent = formatted
  if (playerDurationEl) playerDurationEl.textContent = formatted
  refreshPlayer()
})
audio?.addEventListener('timeupdate', refreshPlayer)
audio?.addEventListener('play', () => {
  markStarted(); if (playButton) playButton.textContent = 'Ⅱ'; if (playerState) playerState.textContent = 'MASTER / PLAYING'; refreshCommand()
})
audio?.addEventListener('pause', () => {
  if (playButton) playButton.textContent = '▶'
  if (playerState && !audio.ended) playerState.textContent = 'MASTER / READY'
  refreshCommand()
})
audio?.addEventListener('ended', () => {
  if (playButton) playButton.textContent = '▶'
  if (playerState) playerState.textContent = 'MASTER / COMPLETE'
  if (seek) seek.value = '1000'
  markComplete()
})

refreshStatus(); refreshCommand()
