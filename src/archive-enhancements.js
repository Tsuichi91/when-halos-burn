import './styles/archive-enhancements.css'
import { chapterList, getChapterHref } from './chapter-data.js'

const root = document.querySelector('#archive-app')
const audio = new Audio()
audio.preload = 'metadata'

let selectedTrackIndex = 0
let musicPlaying = false
let enhancementQueued = false

const noteIndex = [
  { id:'N-01', title:'THE LINE', type:'CORE MOTIF', axis:'BOUNDARY → HORIZON', body:'The Line begins as a political, moral and physical boundary imposed by Vesper. As Jiwon and Taeyun learn each other as people rather than categories, the same image shifts from rule to threshold — and finally to an open horizon.', tags:['POLITICS','PROXIMITY','CHOICE'] },
  { id:'N-02', title:'STAY', type:'JIWON / EMOTIONAL KEY', axis:'PROTECTION → PRESENCE', body:'Jiwon begins by protecting through control, distance and procedure. STAY becomes the quieter version of that instinct: presence without ownership, and care without deciding for the other person.', tags:['JIWON','CARE','AGENCY'] },
  { id:'N-03', title:'TRUTH', type:'TAEYUN / CORE VALUE', axis:'EVIDENCE → ACCOUNTABILITY', body:'Taeyun builds his identity around truth while repeatedly using lies and manipulation to reach it. The motif only resolves when truth includes what he did to Jiwon as well as what HALO did to Vesper.', tags:['TAEYUN','HALO','CONTRADICTION'] },
  { id:'N-04', title:'HANDS', type:'RELATIONAL MOTIF', axis:'RESTRAINT → CARE', body:'Hands move from tactical control and gloves to bare skin, treatment and voluntary touch. They track the difference between taking control of a moment and allowing another person to choose it.', tags:['CONTROL','CONSENT','INTIMACY'] },
  { id:'N-05', title:'NAMES', type:'IDENTITY MOTIF', axis:'ROLE → PERSON', body:'AEGIS and THE ARCHITECT are useful labels because institutions can file them. Jiwon and Taeyun become more important as the story strips authority away from the roles other people assigned them.', tags:['IDENTITY','AEGIS','ARCHITECT'] },
  { id:'N-06', title:'WEAPONS', type:'POWER MOTIF', axis:'ADVANTAGE → RESTRAINT', body:'Weapons define who appears to control an encounter, but the decisive moments often happen when someone refuses to use an available advantage. Restraint becomes more revealing than force.', tags:['POWER','CHOICE','RESTRAINT'] },
  { id:'N-07', title:'PULSE / BREATH', type:'PROXIMITY MOTIF', axis:'THREAT → AWARENESS', body:'Breath and pulse mark the moments when tactical distance collapses. They keep attraction physical without needing explicit imagery: the body notices what ideology is still trying to deny.', tags:['DESIRE','TENSION','PROXIMITY'] },
  { id:'N-08', title:'DOORS / EXITS', type:'AGENCY MOTIF', axis:'ESCAPE → DECISION', body:'The story repeatedly leaves an exit available. The important question is not whether someone can leave, but whether staying, returning or crossing a threshold remains a genuine choice.', tags:['AGENCY','STAY','RETURN'] },
  { id:'N-09', title:'HALO / ECLIPSE', type:'SYSTEMS NOTE', axis:'ORDER ↔ RESISTANCE', body:'HALO and Eclipse are not angel and demon. They are competing systems with persuasive ideals and real moral failures. The archive treats both as structures people can believe in, misuse and eventually outgrow.', tags:['IDEOLOGY','SYSTEMS','VESPER'] },
  { id:'N-10', title:'COFFEE / ORDINARY THINGS', type:'INTIMACY NOTE', axis:'MISSION → ROUTINE', body:'Small repeated objects matter because they make the relationship ordinary. Coffee, familiar rooms and expected arrivals become evidence that intimacy has moved beyond adrenaline and strategy.', tags:['ROUTINE','OBSERVATORY','INTIMACY'] }
]

const timeline = [
  { marker:'BEFORE 2158', phase:'ORIGIN', title:'INSIDE HALO', body:'Taeyun works within the system that will later name him its enemy. He discovers illegal surveillance and political classification embedded inside the HALO architecture.', detail:'Yoon Mirae helps him preserve evidence and pursue exposure from inside the institution.', tags:['TAEYUN','MIRAE','HALO'] },
  { marker:'2158', phase:'SUPPRESSION', title:'MIRAE DISAPPEARS', body:'The attempt to expose the system stops being theoretical when Mirae is detained.', detail:'Her death is concealed, leaving Taeyun with evidence, guilt and no remaining faith that internal procedure can correct HALO.', tags:['MIRAE','SEALED RECORD'] },
  { marker:'2158', phase:'BLACKOUT NIGHT', title:'THE CORE INFILTRATION', body:'Taeyun and Eclipse attempt to enter the Halo Core and release the evidence.', detail:'The Council answers by triggering a controlled broad blackout to isolate the operation and destroy the trail. The resulting chaos spreads beyond anything Taeyun intended.', tags:['ECLIPSE','HALO CORE','BLACKOUT'] },
  { marker:'2158', phase:'BLACKOUT NIGHT', title:'HAN SEOJUN', body:'Seojun independently reaches the same institutional truth from another direction.', detail:'Council internal forces shoot him. Taeyun finds him, receives a surviving data fragment and attempts evacuation, but Seojun dies before he can be saved.', tags:['SEOJUN','TAEYUN','DATA FRAGMENT'] },
  { marker:'2158', phase:'AFTERMATH', title:'THE OFFICIAL STORY', body:'HALO turns catastrophe into a stable public narrative.', detail:'Taeyun becomes the Architect of the Blackout. Eclipse becomes the threat. Seojun becomes a HALO martyr. The complete contradictory record remains sealed in the Core.', tags:['PROPAGANDA','ARCHITECT','MARTYR'] },
  { marker:'~6 MONTHS BEFORE FIRST CONTACT', phase:'THE PLAN', title:'JIWON ENTERS THE FILE', body:'Taeyun begins observing Han Jiwon as a route back into the sealed archive.', detail:'The plan is clinical: profile him, engineer contact, destabilize trust in the Council, gain biometric access and retrieve the record. Taeyun already knows Jiwon is Seojun’s brother.', tags:['JIWON','PROFILE','ACCESS'] },
  { marker:'2164 / 01B', phase:'OPENING', title:'FIRST CONTACT', body:'The plan meets the person.', detail:'Jiwon gives up tactical advantage to protect a civilian. Taeyun has the opening he expected and deliberately refuses to exploit it.', tags:['RECOGNITION','CURIOSITY'], chapter:'01B' },
  { marker:'2164 / 01C', phase:'OPENING', title:'SECOND LOOK', body:'Jiwon reviews the encounter and finds a contradiction the official file cannot explain.', detail:'The question is small but corrosive: Taeyun could have taken the opening. Why did he not?', tags:['ANALYSIS','DOUBT'], chapter:'01C' },
  { marker:'2164 / ACT I–II', phase:'THE LINE MOVES', title:'PROXIMITY BECOMES VOLUNTARY', body:'Conflict becomes repeated contact, then a meeting neither man can blame on orders.', detail:'CROSSFIRE makes the tension physical. AFTER CURFEW brings Jiwon to the Observatory by choice. UNARMED ends with Jiwon making the first kiss his own decision.', tags:['CROSSFIRE','OBSERVATORY','UNARMED'], chapter:'05' },
  { marker:'2164 / ACT III', phase:'WHAT BECAME REAL', title:'OFF THE RECORD', body:'Secret meetings become routine rather than exception.', detail:'Coffee, messages, sleep and familiar touch create a relationship neither the original plan nor HALO’s categories can adequately describe.', tags:['INTIMACY','NAMES','STAY'], chapter:'07' },
  { marker:'2164 / 09', phase:'FRACTURE', title:'FAULT LINE', body:'Jiwon discovers the original dossier, the Seojun connection and the architecture of Taeyun’s plan.', detail:'The betrayal is not that the HALO evidence is false. It is that Jiwon learns he was initially treated as access rather than a person allowed to choose with full information.', tags:['BETRAYAL','DOSSIER','SEOJUN'], chapter:'09' },
  { marker:'2164 / 10', phase:'SEPARATION', title:'CHECK IT YOURSELF', body:'Taeyun sends the archive material without asking Jiwon to return.', detail:'For the first time, evidence is offered without an attached attempt to control the outcome. Jiwon is left to verify the truth independently.', tags:['EVIDENCE','ABSENCE','AGENCY'], chapter:'10' },
  { marker:'2164 / 11–12', phase:'THE CHOICE', title:'THE HALO CORE', body:'Jiwon reaches the sealed record on his own terms and the complete archive is released.', detail:'The public story collapses. Love survives only by becoming equal to the same principle driving the political climax: neither man gets to choose for the other.', tags:['HALO CORE','TRUTH','EQUALITY'], chapter:'12' },
  { marker:'2164 / 13', phase:'EPILOGUE', title:'AFTERLIGHT', body:'Vesper remains standing after certainty breaks.', detail:'The city is not instantly repaired, but the old categories no longer own Jiwon and Taeyun. The Line becomes a horizon rather than a command.', tags:['MORNING','HORIZON','STAY'], chapter:'13' }
]

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

const currentCategory = () => root?.querySelector('[data-archive-category].is-active')?.dataset.archiveCategory || ''

const characterEnhancements = () => {
  const content = root?.querySelector('[data-archive-content]')
  const grid = content?.querySelector('.archive-record-grid')
  if (!grid) return
  grid.classList.add('archive-character-grid')
  grid.querySelectorAll('.archive-record--person').forEach((card, index) => {
    card.classList.add('archive-character-card')
    card.dataset.character = ['JIWON','TAEYUN','SEOJUN'][index] || `CHAR-${index+1}`
    const image = card.querySelector('img')
    if (image) {
      image.loading = 'eager'
      image.decoding = 'async'
    }
  })
}

const renderMusic = () => {
  const target = root?.querySelector('[data-archive-content]')
  if (!target) return
  const selected = chapterList[selectedTrackIndex] || chapterList[0]
  target.innerHTML = `
    <section class="archive-music-v2" data-music-view>
      <div class="archive-player" data-archive-player>
        <div class="archive-player__art"><img src="${selected.image}" alt="" data-player-art /></div>
        <div class="archive-player__shade" aria-hidden="true"></div>
        <div class="archive-player__copy">
          <span data-player-meta>${selected.display} / ${selected.act} / ${selected.perspective}</span>
          <h3 data-player-title>${selected.title}</h3>
          <p data-player-stage>${selected.relationshipStage}</p>
        </div>
        <div class="archive-player__transport">
          <button type="button" data-player-prev aria-label="Previous track">‹</button>
          <button class="archive-player__play" type="button" data-player-toggle aria-label="Play ${selected.title}"><span>▶</span></button>
          <button type="button" data-player-next aria-label="Next track">›</button>
        </div>
        <div class="archive-player__timeline">
          <span data-player-current>0:00</span>
          <input type="range" min="0" max="1000" value="0" step="1" data-player-seek aria-label="Track position" />
          <span data-player-duration>0:00</span>
        </div>
        <div class="archive-player__status"><span>ARCHIVE AUDIO</span><strong data-player-state>READY</strong></div>
      </div>

      <div class="archive-tracklist">
        ${chapterList.map((chapter, index) => `
          <article class="archive-track-row ${index === selectedTrackIndex ? 'is-selected' : ''}" data-track-index="${index}">
            <button class="archive-track-row__play" type="button" data-track-play="${index}" aria-label="Play ${chapter.title}">▶</button>
            <span class="archive-track-row__number">${chapter.display}</span>
            <div class="archive-track-row__copy"><small>${chapter.act} / ${chapter.perspective}</small><strong>${chapter.title}</strong></div>
            <span class="archive-track-row__stage">${chapter.relationshipStage}</span>
            <a href="${getChapterHref(chapter.code)}" aria-label="Open ${chapter.title} chapter">CHAPTER ›</a>
          </article>
        `).join('')}
      </div>
    </section>
  `
  bindMusic()
  syncMusicUI()
}

const selectTrack = (index, autoplay = false) => {
  const chapter = chapterList[index]
  if (!chapter) return
  selectedTrackIndex = index
  const sameSource = audio.dataset.chapter === chapter.code
  if (!sameSource) {
    audio.src = chapter.audio
    audio.dataset.chapter = chapter.code
    audio.load()
  }
  if (autoplay) {
    audio.play().then(() => { musicPlaying = true; syncMusicUI() }).catch(() => { musicPlaying = false; syncMusicUI() })
  } else {
    musicPlaying = !audio.paused && sameSource
    syncMusicUI()
  }
}

const syncMusicUI = () => {
  if (currentCategory() !== 'music') return
  const chapter = chapterList[selectedTrackIndex] || chapterList[0]
  const art = root.querySelector('[data-player-art]')
  const meta = root.querySelector('[data-player-meta]')
  const title = root.querySelector('[data-player-title]')
  const stage = root.querySelector('[data-player-stage]')
  const toggle = root.querySelector('[data-player-toggle]')
  const state = root.querySelector('[data-player-state]')
  const current = root.querySelector('[data-player-current]')
  const duration = root.querySelector('[data-player-duration]')
  const seek = root.querySelector('[data-player-seek]')

  if (art) art.src = chapter.image
  if (meta) meta.textContent = `${chapter.display} / ${chapter.act} / ${chapter.perspective}`
  if (title) title.textContent = chapter.title
  if (stage) stage.textContent = chapter.relationshipStage
  if (toggle) {
    toggle.innerHTML = `<span>${musicPlaying && !audio.paused ? 'Ⅱ' : '▶'}</span>`
    toggle.setAttribute('aria-label', `${musicPlaying && !audio.paused ? 'Pause' : 'Play'} ${chapter.title}`)
  }
  if (state) state.textContent = musicPlaying && !audio.paused ? 'PLAYING' : audio.ended ? 'COMPLETE' : 'READY'
  if (current) current.textContent = formatTime(audio.currentTime)
  if (duration) duration.textContent = formatTime(audio.duration)
  if (seek) seek.value = Number.isFinite(audio.duration) && audio.duration > 0 ? Math.round((audio.currentTime / audio.duration) * 1000) : 0

  root.querySelectorAll('[data-track-index]').forEach((row, index) => row.classList.toggle('is-selected', index === selectedTrackIndex))
  root.querySelectorAll('[data-track-play]').forEach((button, index) => {
    button.textContent = index === selectedTrackIndex && musicPlaying && !audio.paused ? 'Ⅱ' : '▶'
  })
}

const bindMusic = () => {
  root.querySelector('[data-player-toggle]')?.addEventListener('click', () => {
    const chapter = chapterList[selectedTrackIndex]
    if (audio.dataset.chapter !== chapter.code) selectTrack(selectedTrackIndex, true)
    else if (audio.paused) audio.play().then(() => { musicPlaying = true; syncMusicUI() })
    else { audio.pause(); musicPlaying = false; syncMusicUI() }
  })
  root.querySelector('[data-player-prev]')?.addEventListener('click', () => selectTrack((selectedTrackIndex - 1 + chapterList.length) % chapterList.length, musicPlaying))
  root.querySelector('[data-player-next]')?.addEventListener('click', () => selectTrack((selectedTrackIndex + 1) % chapterList.length, musicPlaying))
  root.querySelectorAll('[data-track-play]').forEach((button) => button.addEventListener('click', () => {
    const index = Number(button.dataset.trackPlay)
    if (index === selectedTrackIndex && audio.dataset.chapter === chapterList[index].code && !audio.paused) {
      audio.pause(); musicPlaying = false; syncMusicUI(); return
    }
    selectTrack(index, true)
  }))
  root.querySelector('[data-player-seek]')?.addEventListener('input', (event) => {
    if (!Number.isFinite(audio.duration)) return
    audio.currentTime = (Number(event.target.value) / 1000) * audio.duration
    syncMusicUI()
  })
}

const renderNotes = () => {
  const target = root?.querySelector('[data-archive-content]')
  if (!target) return
  target.innerHTML = `
    <section class="archive-notes-v2">
      <header class="archive-notes-intro">
        <span>ANNOTATION INDEX / RECURRING SIGNALS</span>
        <h3>READ WHAT REPEATS.</h3>
        <p>These records track the symbols, words and physical details that change meaning as the story changes. They do not replace the chapter record; they reveal the pattern underneath it.</p>
      </header>
      <div class="archive-note-grid-v2">
        ${noteIndex.map((note) => `
          <article class="archive-note-v2">
            <div class="archive-note-v2__head"><span>${note.id}</span><small>${note.type}</small></div>
            <h3>${note.title}</h3>
            <strong>${note.axis}</strong>
            <p>${note.body}</p>
            <div>${note.tags.map((tag) => `<i>${tag}</i>`).join('')}</div>
          </article>
        `).join('')}
      </div>
    </section>
  `
}

const renderTimeline = () => {
  const target = root?.querySelector('[data-archive-content]')
  if (!target) return
  target.innerHTML = `
    <section class="archive-timeline-v2">
      <header class="archive-timeline-intro">
        <span>CHRONOLOGY / VERIFIED + RECONSTRUCTED RECORDS</span>
        <h3>THE STORY BEFORE THE STORY.</h3>
        <p>The public timeline begins with a villain and a martyr. The archive begins earlier — and keeps going after those labels stop being useful.</p>
      </header>
      <div class="archive-timeline-line">
        ${timeline.map((event, index) => `
          <article class="archive-timeline-event">
            <div class="archive-timeline-event__index">${String(index + 1).padStart(2,'0')}</div>
            <div class="archive-timeline-event__marker"><time>${event.marker}</time><span>${event.phase}</span></div>
            <div class="archive-timeline-event__body">
              <h3>${event.title}</h3>
              <p>${event.body}</p>
              <small>${event.detail}</small>
              <div>${event.tags.map((tag) => `<i>${tag}</i>`).join('')}</div>
              ${event.chapter ? `<a href="${getChapterHref(event.chapter)}">OPEN CHAPTER ›</a>` : ''}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `
}

const enhanceCurrentCategory = () => {
  if (!root?.children.length) return
  const category = currentCategory()
  const content = root.querySelector('[data-archive-content]')
  if (!content) return

  if (category === 'characters' && content.dataset.enhancedView !== 'characters') {
    content.dataset.enhancedView = 'characters'
    characterEnhancements()
  } else if (category === 'music' && content.dataset.enhancedView !== 'music') {
    content.dataset.enhancedView = 'music'
    renderMusic()
  } else if (category === 'notes' && content.dataset.enhancedView !== 'notes') {
    content.dataset.enhancedView = 'notes'
    renderNotes()
  } else if (category === 'timeline' && content.dataset.enhancedView !== 'timeline') {
    content.dataset.enhancedView = 'timeline'
    renderTimeline()
  }
}

const queueEnhancement = () => {
  if (enhancementQueued) return
  enhancementQueued = true
  requestAnimationFrame(() => {
    enhancementQueued = false
    enhanceCurrentCategory()
  })
}

const initialize = () => {
  if (!root?.children.length) {
    const observer = new MutationObserver(() => {
      if (!root.children.length) return
      observer.disconnect()
      initialize()
    })
    observer.observe(root, { childList:true })
    return
  }

  root.querySelector('[data-archive-category="all"]')?.remove()
  const chaptersButton = root.querySelector('[data-archive-category="chapters"]')
  const active = currentCategory()
  if (!active || active === 'all' || root.querySelector('[data-archive-title]')?.textContent === 'ALL RECORDS') chaptersButton?.click()

  root.querySelectorAll('[data-archive-category]').forEach((button) => button.addEventListener('click', queueEnhancement))
  root.querySelector('[data-archive-search]')?.addEventListener('input', queueEnhancement)

  const content = root.querySelector('[data-archive-content]')
  if (content) new MutationObserver(queueEnhancement).observe(content, { childList:true })

  queueEnhancement()
}

audio.addEventListener('timeupdate', syncMusicUI)
audio.addEventListener('loadedmetadata', syncMusicUI)
audio.addEventListener('play', () => { musicPlaying = true; syncMusicUI() })
audio.addEventListener('pause', () => { if (!audio.ended) musicPlaying = false; syncMusicUI() })
audio.addEventListener('ended', () => { musicPlaying = false; syncMusicUI() })

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
window.addEventListener('pageshow', () => requestAnimationFrame(initialize))
