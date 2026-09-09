import './styles/story-home-full.css'
import { chapterList, chapters, actMeta, getChapterHref } from './chapter-data.js'

const root = document.querySelector('#story-hub')
const completionStorageKey = 'whb-story-complete-v1'
const startedStorageKey = 'whb-story-started-v1'
const worldIntroStorageKey = 'whb-world-intro-seen-v1'

const getStoredSet = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return new Set(Array.isArray(value) ? value : [])
  } catch { return new Set() }
}

const groups = ['OPENING','ACT I','ACT II','ACT III','ACT IV','ACT V','EPILOGUE']

const renderCard = (chapter) => `
  <article class="story-home-card story-home-card--full" data-full-chapter-card="${chapter.code}">
    <img src="${chapter.image}" alt="" aria-hidden="true" />
    <div class="story-home-card__wash" aria-hidden="true"></div>
    <div class="story-home-card__inner">
      <span class="story-home-card__number">${chapter.display}</span>
      <div class="story-home-card__copy">
        <small>${chapter.perspective} / ${chapter.act}</small>
        <h3>${chapter.titleLines.join('<br />')}</h3>
      </div>
      <div class="story-home-card__footer">
        <span data-full-chapter-status="${chapter.code}">NOT STARTED</span>
        <a href="${getChapterHref(chapter.code)}"><span>DETAILS</span> ›</a>
      </div>
    </div>
  </article>
`

const renderAct = (act) => {
  const meta = actMeta[act]
  const items = chapterList.filter((chapter) => chapter.act === act)
  return `
    <section class="story-home__act" data-story-act="${act}">
      <header class="story-home__act-head">
        <div><span>${meta.label}</span><h2>${meta.title}</h2></div>
        <p>${meta.description}</p>
      </header>
      <div class="story-home__chapter-grid story-home__chapter-grid--full">
        ${items.map(renderCard).join('')}
      </div>
    </section>
  `
}

const build = () => {
  if (!root) return
  root.innerHTML = `
    <div class="story-home story-home--full">
      <header class="story-home__topbar">
        <a class="story-home__identity" href="./index.html" aria-label="WHEN HALOS BURN home">
          <span class="story-home__halo-mark" aria-hidden="true"></span>
          <span class="story-home__identity-copy"><span>A CINEMATIC</span><span>CONCEPT ALBUM</span></span>
        </a>
        <nav class="story-home__nav" aria-label="Story Mode navigation">
          <a href="./index.html">HOME</a>
          <a class="is-active" href="#story-hub">STORY MODE</a>
          <a href="./archive.html">ARCHIVE MODE</a>
          <button type="button" data-full-replay-world>WORLD</button>
          <span aria-disabled="true">EXTRAS</span>
        </nav>
        <div class="story-home__city"><span>VESPER CITY<br />2164</span><span class="story-home__menu-mark" aria-hidden="true"><i></i><i></i><i></i></span></div>
      </header>

      <section class="story-home__hero">
        <div class="story-home__hero-art" aria-hidden="true"><img src="./images/landing/vesper-city.png" alt="" /></div>
        <div class="story-home__hero-shade" aria-hidden="true"></div>
        <div class="story-home__hero-grid" aria-hidden="true"></div>
        <div class="story-home__hero-copy">
          <p class="story-home__eyebrow">STORY MODE</p>
          <h1>WHEN HALOS BURN</h1>
          <span class="story-home__tagline">SOME LINES WERE NEVER MEANT TO STAY CLEAN</span>
          <p class="story-home__intro">STEP INTO THE STORY.<br />EXPERIENCE THE ALBUM THROUGH SCENES, PERSPECTIVES AND CHOICES.</p>
          <button class="story-home__continue" type="button" data-full-continue>
            <span data-full-continue-label>START</span><i>›</i>
          </button>
          <div class="story-home__continue-meta"><span data-full-continue-title>PROLOGUE: THE LINE</span><span data-full-continue-status>NOT STARTED</span></div>
        </div>
        <div class="story-home__hero-edge" aria-hidden="true"><span>DIFFERENT</span><span>PEOPLE</span><span>SAME</span><span>SKY</span></div>
      </section>

      <main class="story-home__main story-home__main--full">
        <div class="story-home__chapters-head story-home__chapters-head--full">
          <div><span>CAMPAIGN / COMPLETE ALBUM</span><h2>CHAPTERS</h2></div>
          <span data-full-progress>0 / 15 COMPLETE</span>
        </div>
        ${groups.map(renderAct).join('')}
        <section class="story-home__perspective" aria-label="Story Mode description">
          <strong>YOUR STORY.<br />YOUR PERSPECTIVE.</strong><i aria-hidden="true"></i>
          <p>FOLLOW THE COMPLETE ALBUM THROUGH FIFTEEN CHAPTERS. EVERY PERSPECTIVE ADDS CONTEXT; NONE OF THEM GETS TO OWN THE TRUTH ALONE.</p>
        </section>
      </main>

      <footer class="story-home__footer" aria-hidden="true">
        <div>CONTROL<br />OBSERVE<br />PROTECT</div>
        <div class="story-home__footer-center"><i></i>ENTER VESPER</div>
        <div>QUESTION<br />DISRUPT<br />RECLAIM</div>
      </footer>

      <nav class="story-home__mobile-dock" aria-label="Mobile navigation">
        <a href="./index.html"><i>⌂</i><span>HOME</span></a>
        <a class="is-active" href="#story-hub"><i>▣</i><span>STORY</span></a>
        <a href="./archive.html"><i>▤</i><span>ARCHIVE</span></a>
        <button type="button" data-full-replay-world><i>◎</i><span>WORLD</span></button>
        <span aria-disabled="true"><i>◇</i><span>EXTRAS</span></span>
      </nav>
    </div>
  `
  bind()
  updateProgress()
}

const getProgressState = () => ({ completed: getStoredSet(completionStorageKey), started: getStoredSet(startedStorageKey) })

const getContinueCode = (completed, started) => {
  const inProgress = chapterList.find((chapter) => started.has(chapter.code) && !completed.has(chapter.code))
  if (inProgress) return inProgress.code
  const next = chapterList.find((chapter) => !completed.has(chapter.code))
  return next?.code || '01A'
}

const updateProgress = () => {
  if (!root) return
  const { completed, started } = getProgressState()
  chapterList.forEach((chapter) => {
    const card = root.querySelector(`[data-full-chapter-card="${chapter.code}"]`)
    const status = root.querySelector(`[data-full-chapter-status="${chapter.code}"]`)
    const done = completed.has(chapter.code)
    const active = started.has(chapter.code) && !done
    card?.classList.toggle('is-complete', done)
    card?.classList.toggle('is-in-progress', active)
    if (status) status.textContent = done ? 'COMPLETE' : active ? 'IN PROGRESS' : 'NOT STARTED'
  })

  const completeCount = chapterList.filter((chapter) => completed.has(chapter.code)).length
  const progress = root.querySelector('[data-full-progress]')
  if (progress) progress.textContent = `${completeCount} / 15 COMPLETE`

  const code = getContinueCode(completed, started)
  const current = chapters[code]
  const allComplete = completeCount === chapterList.length
  const button = root.querySelector('[data-full-continue]')
  const label = root.querySelector('[data-full-continue-label]')
  const title = root.querySelector('[data-full-continue-title]')
  const status = root.querySelector('[data-full-continue-status]')
  if (button) button.dataset.chapter = code
  if (label) label.textContent = allComplete ? 'REPLAY STORY' : started.has(code) ? 'CONTINUE' : 'START'
  if (title) title.textContent = `${current.display} / ${current.title}`
  if (status) status.textContent = allComplete ? 'STORY COMPLETE' : started.has(code) ? 'IN PROGRESS' : current.act
}

const replayWorld = () => {
  try { window.localStorage.removeItem(worldIntroStorageKey) } catch { /* optional */ }
  window.location.href = './story.html?world=1#vesper'
}

const bind = () => {
  root.querySelector('[data-full-continue]')?.addEventListener('click', (event) => {
    const code = event.currentTarget.dataset.chapter || '01A'
    window.location.href = getChapterHref(code)
  })
  root.querySelectorAll('[data-full-replay-world]').forEach((button) => button.addEventListener('click', replayWorld))
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(build), { once: true })
else requestAnimationFrame(build)
window.addEventListener('pageshow', updateProgress)
