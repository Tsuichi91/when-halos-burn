import './styles/site.css'
import './styles/world-mode.css'

const root = document.querySelector('#world-app')
const worldIntroStorageKey = 'whb-world-intro-seen-v1'

const places = [
  {
    id:'LOC-00', title:'VESPER CITY', type:'PRIMARY SETTING / 2164', image:'./images/landing/vesper-city.png',
    role:'THE SYSTEM AROUND THEM', body:'A surveillance metropolis built on the promise that enough certainty can keep everyone safe. Its polished surfaces make classification feel ordinary long before anyone asks who gets to define what safety means.',
    tags:['CITY','SURVEILLANCE','THE LINE']
  },
  {
    id:'LOC-01', title:'HALO HEADQUARTERS', type:'CONTROL GRID / CIVIC AUTHORITY', image:'./images/world/halo-headquarters.png',
    role:'ORDER / CERTAINTY', body:'White, silver and symmetrical by design. HALO turns protection into architecture: beautiful, legible and almost impossible to question from inside it.',
    tags:['HALO','AUTHORITY','ORDER']
  },
  {
    id:'LOC-02', title:'ECLIPSE HUB', type:'SHADOW GRID / OLD TRANSIT', image:'./images/world/eclipse-headquarters.png',
    role:'RESISTANCE / OPERATIONS', body:'A repurposed underground transit network where obsolete infrastructure and advanced systems coexist outside HALO’s clean geometry.',
    tags:['ECLIPSE','SHADOW GRID','RESISTANCE']
  },
  {
    id:'LOC-03', title:'THE OBSERVATORY', type:'NEUTRAL GROUND / RECURRING LOCATION', image:'./images/archive/locations/observatory.png',
    role:'PROXIMITY / INTIMACY', body:'A place neither HALO nor Eclipse fully owns. Repeated voluntary meetings slowly turn neutral ground into one of the most emotionally charged spaces in the story.',
    tags:['NEUTRAL','OBSERVATORY','STAY']
  },
  {
    id:'LOC-04', title:'HALO CORE', type:'SEALED ARCHIVE / CENTRAL SYSTEM', image:'./images/archive/locations/halo-core.png',
    role:'TRUTH / RELEASE', body:'The institutional heart of HALO and the place where the complete Blackout archive remains sealed until the official story can no longer contain it.',
    tags:['HALO CORE','ARCHIVE','TRUTH']
  }
]

const placeCard = (place, index) => `
  <article class="world-place" data-place-index="${index}">
    <div class="world-place__art" aria-hidden="true"><img src="${place.image}" alt="" loading="lazy" decoding="async" /></div>
    <div class="world-place__shade" aria-hidden="true"></div>
    <div class="world-place__head"><span>${place.id}</span><span>${place.type}</span></div>
    <div class="world-place__copy">
      <small>${place.role}</small>
      <h3>${place.title}</h3>
      <p>${place.body}</p>
      <div>${place.tags.map((tag) => `<i>${tag}</i>`).join('')}</div>
    </div>
  </article>
`

const build = () => {
  if (!root) return
  root.innerHTML = `
    <header class="world-topbar">
      <a class="world-topbar__identity" href="./index.html" aria-label="WHEN HALOS BURN home">
        <span class="world-topbar__mark" aria-hidden="true"></span>
        <span><b>A CINEMATIC</b><b>CONCEPT ALBUM</b></span>
      </a>
      <nav class="world-topbar__nav" aria-label="Primary navigation">
        <a href="./index.html">HOME</a>
        <a href="./story.html#story-hub">STORY MODE</a>
        <a href="./archive.html">ARCHIVE MODE</a>
        <a class="is-active" href="./world.html">WORLD</a>
        <span aria-disabled="true">EXTRAS</span>
      </nav>
      <div class="world-topbar__city"><span>VESPER CITY</span><span>2164</span><i></i></div>
    </header>

    <section class="world-hero" id="world-top">
      <div class="world-hero__art" aria-hidden="true"><img src="./images/landing/vesper-city.png" alt="" fetchpriority="high" /></div>
      <div class="world-hero__shade" aria-hidden="true"></div>
      <div class="world-hero__grid" aria-hidden="true"></div>
      <div class="world-hero__axis" aria-hidden="true"></div>
      <div class="world-hero__copy">
        <p>WORLD / VESPER CITY</p>
        <h1>VESPER <span>CITY</span></h1>
        <strong>THE CITY THAT DREW THE LINE.</strong>
        <small>Explore the systems, spaces and fault lines surrounding the story.</small>
        <div class="world-hero__actions">
          <a href="#world-layers">EXPLORE WORLD <i>↓</i></a>
          <button type="button" data-replay-world>REPLAY WORLD INTRO <i>↗</i></button>
        </div>
      </div>
      <dl class="world-hero__facts">
        <div><dt>YEAR</dt><dd>2164</dd></div>
        <div><dt>AUTHORITY</dt><dd>HALO COUNCIL</dd></div>
        <div><dt>SECURITY</dt><dd>HALO PROTOCOL</dd></div>
        <div><dt>RESISTANCE</dt><dd>ECLIPSE</dd></div>
      </dl>
      <div class="world-hero__edge" aria-hidden="true"><span>ORDER</span><i></i><span>RESISTANCE</span></div>
    </section>

    <nav class="world-index" aria-label="World sections">
      <span>WORLD INDEX</span>
      <a href="#vesper-city" data-world-nav="vesper-city">00 / VESPER</a>
      <a href="#halo-system" data-world-nav="halo-system">01 / HALO</a>
      <a href="#eclipse-system" data-world-nav="eclipse-system">02 / ECLIPSE</a>
      <a href="#key-locations" data-world-nav="key-locations">03 / LOCATIONS</a>
    </nav>

    <main class="world-content" id="world-layers">
      <section class="world-intro-copy">
        <span>WORLD OVERVIEW / SYSTEM MAP</span>
        <h2>ONE CITY.<br />TWO COMPETING IDEAS OF FREEDOM.</h2>
        <p>Vesper is not divided into a clean good side and bad side. HALO promises safety through certainty. Eclipse resists the price of that certainty. The story begins when the people inside those systems stop fitting the roles assigned to them.</p>
      </section>

      <section class="world-layer world-layer--vesper" id="vesper-city" data-world-section="vesper-city">
        <div class="world-layer__art" aria-hidden="true"><img src="./images/landing/vesper-city.png" alt="" loading="lazy" decoding="async" /></div>
        <div class="world-layer__shade" aria-hidden="true"></div>
        <div class="world-layer__number">00</div>
        <div class="world-layer__copy">
          <span>THE CITY / CIVIC LAYER</span>
          <h2>VESPER CITY</h2>
          <strong>SAFETY BECAME A SYSTEM BEFORE IT BECAME A QUESTION.</strong>
          <p>Vesper’s towers, transit, public infrastructure and civic networks are built around visibility. The city does not feel imprisoned because most of its control is presented as convenience, protection and predictability.</p>
          <p>That is why the Blackout matters so much. It does not only interrupt power. It fractures the belief that the system describing reality is the same thing as reality itself.</p>
          <dl>
            <div><dt>PRIMARY LANGUAGE</dt><dd>ORDER</dd></div>
            <div><dt>VISIBLE MOTIF</dt><dd>LINES / GLASS</dd></div>
            <div><dt>PUBLIC PROMISE</dt><dd>SAFETY</dd></div>
            <div><dt>HIDDEN COST</dt><dd>CLASSIFICATION</dd></div>
          </dl>
        </div>
      </section>

      <section class="world-system-pair" aria-label="Vesper systems">
        <article class="world-system world-system--halo" id="halo-system" data-world-section="halo-system">
          <div class="world-system__art" aria-hidden="true"><img src="./images/world/halo-headquarters.png" alt="" loading="lazy" decoding="async" /></div>
          <div class="world-system__shade" aria-hidden="true"></div>
          <div class="world-system__copy">
            <span>01 / THE SYSTEM</span>
            <h2>HALO</h2>
            <strong>SAFETY THROUGH CERTAINTY.</strong>
            <p>HALO is Vesper’s governing security architecture: surveillance, prediction and classification presented as a coherent civic promise. Its strongest quality is also its danger — the system is designed to make uncertainty look like failure.</p>
            <dl>
              <div><dt>AUTHORITY</dt><dd>HALO COUNCIL</dd></div>
              <div><dt>PROTOCOL</dt><dd>INTEGRATED SURVEILLANCE</dd></div>
              <div><dt>PUBLIC IDEAL</dt><dd>ORDER</dd></div>
              <div><dt>VISUAL LANGUAGE</dt><dd>SYMMETRY / CIRCLES</dd></div>
            </dl>
          </div>
        </article>

        <article class="world-system world-system--eclipse" id="eclipse-system" data-world-section="eclipse-system">
          <div class="world-system__art" aria-hidden="true"><img src="./images/world/eclipse-headquarters.png" alt="" loading="lazy" decoding="async" /></div>
          <div class="world-system__shade" aria-hidden="true"></div>
          <div class="world-system__copy">
            <span>02 / THE RESISTANCE</span>
            <h2>ECLIPSE</h2>
            <strong>QUESTION. DISRUPT. RECLAIM.</strong>
            <p>Eclipse moves through Vesper’s blind spots, obsolete infrastructure and abandoned assumptions. It opposes HALO’s monopoly on truth without pretending resistance is automatically clean, harmless or morally simple.</p>
            <dl>
              <div><dt>STRUCTURE</dt><dd>DECENTRALIZED</dd></div>
              <div><dt>TERRITORY</dt><dd>SHADOW GRID</dd></div>
              <div><dt>PUBLIC LABEL</dt><dd>THREAT</dd></div>
              <div><dt>VISUAL LANGUAGE</dt><dd>ASYMMETRY / REFLECTION</dd></div>
            </dl>
          </div>
        </article>
      </section>

      <section class="world-line">
        <div class="world-line__halo"><span>HALO SEES</span><strong>CLASSIFICATION<br />ORDER<br />CERTAINTY</strong></div>
        <div class="world-line__axis" aria-hidden="true"><i></i></div>
        <div class="world-line__copy"><span>THE LINE</span><p>The conflict is not simply control versus freedom. It is about who gets to define danger, truth and protection — and what happens when a person refuses to remain inside the category that made the system feel stable.</p></div>
        <div class="world-line__eclipse"><span>ECLIPSE SEES</span><strong>BLIND SPOTS<br />RESISTANCE<br />RECLAMATION</strong></div>
      </section>

      <section class="world-locations" id="key-locations" data-world-section="key-locations">
        <header class="world-locations__head">
          <div><span>03 / PLACES THAT MATTER</span><h2>KEY LOCATIONS</h2></div>
          <p>World Mode shows what these places mean to Vesper. For deeper files, source records and story links, the Archive remains the evidence layer.</p>
        </header>
        <div class="world-place-grid">${places.map(placeCard).join('')}</div>
        <div class="world-locations__footer"><a href="./archive.html">OPEN VESPER ARCHIVE <i>↗</i></a></div>
      </section>

      <section class="world-exit">
        <span>WORLD STATE / 2164</span>
        <h2>THE CITY IS STILL STANDING.</h2>
        <p>What changes is not Vesper’s existence. It is who is allowed to define what happened inside it.</p>
        <div><a href="./story.html#story-hub">ENTER STORY MODE <i>→</i></a><button type="button" data-replay-world>REPLAY WORLD INTRO <i>↗</i></button></div>
      </section>
    </main>

    <footer class="world-footer" aria-hidden="true"><span>CONTROL / OBSERVE / PROTECT</span><i></i><span>QUESTION / DISRUPT / RECLAIM</span></footer>

    <nav class="world-mobile-dock" aria-label="Mobile navigation">
      <a href="./index.html"><i>⌂</i><span>HOME</span></a>
      <a href="./story.html#story-hub"><i>▣</i><span>STORY</span></a>
      <a href="./archive.html"><i>▤</i><span>ARCHIVE</span></a>
      <a class="is-active" href="./world.html"><i>◎</i><span>WORLD</span></a>
      <span aria-disabled="true"><i>◇</i><span>EXTRAS</span></span>
    </nav>
  `

  bind()
}

const replayWorldIntro = () => {
  try { window.localStorage.removeItem(worldIntroStorageKey) } catch { /* storage optional */ }
  window.location.href = './story.html?world=1#vesper'
}

const bind = () => {
  root.querySelectorAll('[data-replay-world]').forEach((button) => button.addEventListener('click', replayWorldIntro))

  root.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'))
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' })
  }))

  if ('IntersectionObserver' in window) {
    const links = [...root.querySelectorAll('[data-world-nav]')]
    const sections = [...root.querySelectorAll('[data-world-section]')]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (!visible) return
      links.forEach((link) => link.classList.toggle('is-active', link.dataset.worldNav === visible.target.dataset.worldSection))
    }, { rootMargin:'-22% 0px -58% 0px', threshold:[0,.15,.35,.6] })
    sections.forEach((section) => observer.observe(section))
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once:true })
else build()
