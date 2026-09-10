import './styles/world-civic-life.css'

const root = document.querySelector('#world-app')

const civicSystems = [
  {
    code:'CV-01', title:'IDENTITY & ACCESS', district:'CITYWIDE / HALO PROTOCOL',
    body:'Identity verification is woven into ordinary movement: building entry, civic services and restricted areas respond to recognized residents with almost no visible friction. The convenience is real. So is the record created by every successful interaction.',
    note:'CONTROL FEELS SMALLEST WHEN IT WORKS.'
  },
  {
    code:'CV-02', title:'TRANSIT', district:'MERIDIAN / CROWN / GLASSLINE',
    body:'The active network predicts demand, adjusts routes and moves most residents through Vesper without requiring them to think about the system underneath. Older branches remain slower and less integrated — which is exactly why Eclipse values them.',
    note:'THE FASTEST ROUTE IS ALSO THE MOST VISIBLE.'
  },
  {
    code:'CV-03', title:'HOME', district:'GLASSLINE / LOWER GRID',
    body:'Housing reveals Vesper’s uneven relationship with integration. Glassline apartments anticipate residents through near-total network coverage; Lower Grid homes rely on the same civic systems, but upgrades arrive unevenly and manual workarounds remain ordinary.',
    note:'CONVENIENCE IS NOT DISTRIBUTED EQUALLY.'
  },
  {
    code:'CV-04', title:'WORK & ROUTINE', district:'MERIDIAN WARD / CITYWIDE',
    body:'Schedules, access permissions and public infrastructure make daily work predictable. Most residents encounter HALO less as an officer at a door and more as a system that already knows which door should open.',
    note:'ORDER BECOMES HABIT BEFORE IT BECOMES IDEOLOGY.'
  },
  {
    code:'CV-05', title:'PUBLIC SPACE', district:'CIVIC GRID / BORDER',
    body:'Vesper’s plazas, concourses and transit halls are designed to feel open, clean and safe. Surveillance rarely announces itself. The city’s preferred form of control is architectural and procedural, not theatrical.',
    note:'VISIBILITY IS BUILT INTO THE ROOM.'
  },
  {
    code:'CV-06', title:'ORDINARY THINGS', district:'EVERYWHERE',
    body:'Coffee, late trains, convenience counters, small apartments, tired commutes and familiar routes still define most lives. The story matters because political systems do not replace ordinary life — they sit quietly inside it.',
    note:'A CITY IS MORE THAN THE SYSTEM WATCHING IT.'
  }
]

const civicCards = () => civicSystems.map((item) => `
  <article class="world-civic-card">
    <div class="world-civic-card__head"><span>${item.code}</span><small>${item.district}</small></div>
    <h3>${item.title}</h3>
    <p>${item.body}</p>
    <strong>${item.note}</strong>
  </article>
`).join('')

const markup = () => `
  <section class="world-civic" id="civic-life" aria-labelledby="world-civic-title">
    <header class="world-civic__head">
      <div><span>VESPER CITY / CIVIC LIFE</span><h2 id="world-civic-title">LIVING IN<br />VESPER.</h2></div>
      <p>Most people do not experience Vesper as a dystopia. They experience a city that is clean, efficient and very good at removing friction. HALO’s reach becomes politically dangerous precisely because so much of it is also useful.</p>
    </header>

    <div class="world-civic__thesis">
      <span>THE DAILY CONTRADICTION</span>
      <strong>THE SYSTEM DOES NOT ASK TO BE NOTICED.</strong>
      <p>Protection arrives as an unlocked door, a route adjusted before congestion forms, an identity check completed before anyone reaches the gate. The same network that makes daily life easier also builds the classifications HALO trusts when certainty becomes policy.</p>
    </div>

    <div class="world-civic__grid">${civicCards()}</div>
  </section>

  <section class="world-blackout" id="blackout-legacy" aria-labelledby="world-blackout-title">
    <header class="world-blackout__head">
      <div><span>2158 → 2164 / CIVIC MEMORY</span><h2 id="world-blackout-title">THE BLACKOUT<br />LEGACY.</h2></div>
      <p>The Blackout became more than a disaster. It became the story Vesper used to explain why greater certainty was necessary — and why some questions could be treated as threats.</p>
    </header>

    <div class="world-blackout__split">
      <article class="world-blackout__memory">
        <div class="world-blackout__year"><span>2158</span><small>WHAT VESPER REMEMBERS</small></div>
        <h3>THE OFFICIAL MEMORY</h3>
        <p>Public history describes a catastrophic Eclipse attack led by Kang Taeyun, remembers Han Seojun as a HALO martyr, and treats the Blackout as proof that fragmented authority and hidden networks endanger ordinary people.</p>
        <dl>
          <div><dt>PUBLIC VILLAIN</dt><dd>KANG TAEYUN / THE ARCHITECT</dd></div>
          <div><dt>PUBLIC MARTYR</dt><dd>HAN SEOJUN</dd></div>
          <div><dt>POLITICAL LESSON</dt><dd>MORE CERTAINTY = MORE SAFETY</dd></div>
        </dl>
      </article>

      <div class="world-blackout__fault" aria-hidden="true"><span></span><i></i><span></span></div>

      <article class="world-blackout__aftermath">
        <div class="world-blackout__year"><span>2164</span><small>WHAT VESPER BECAME</small></div>
        <h3>THE STRUCTURAL AFTERMATH</h3>
        <p>Six years later, the city is more integrated, more predictable and more dependent on HALO’s interpretation of risk. The Blackout lives on in expanded security doctrine, memorial culture and a public vocabulary that makes resistance easier to classify than to understand.</p>
        <dl>
          <div><dt>SECURITY STATE</dt><dd>EXPANDED / NORMALIZED</dd></div>
          <div><dt>NETWORK STATE</dt><dd>DENSER / UNEVEN AT THE EDGES</dd></div>
          <div><dt>UNRESOLVED QUESTION</dt><dd>WHO CONTROLLED THE STORY?</dd></div>
        </dl>
      </article>
    </div>

    <div class="world-blackout__effects">
      <article><span>01 / MEMORY</span><strong>SEOJUN BECOMES A SYMBOL.</strong><p>The person disappears behind the martyr narrative. Jiwon grows up inside a public version of his brother that feels personal because the city repeats it as fact.</p></article>
      <article><span>02 / SECURITY</span><strong>EMERGENCY LOGIC BECOMES INFRASTRUCTURE.</strong><p>Measures justified by the Blackout become ordinary civic architecture. What began as protection after crisis gradually becomes the baseline residents stop noticing.</p></article>
      <article><span>03 / MYTH</span><strong>THE ARCHITECT BECOMES EASIER TO HATE THAN TO EXAMINE.</strong><p>Taeyun’s real responsibility for the operation’s chaos makes the official lie durable: the story does not need to invent all of his guilt, only redirect it.</p></article>
      <article><span>04 / FRACTURE</span><strong>THE CITY STILL WORKS — UNTIL THE RECORD DOESN’T.</strong><p>By 2164, the danger is not that Vesper has stopped functioning. It is that functioning well has become part of the evidence used to argue that HALO must also be right.</p></article>
    </div>
  </section>
`

const initialize = () => {
  if (!root || root.querySelector('#civic-life')) return

  const insert = () => {
    const map = root.querySelector('#city-map')
    const systems = root.querySelector('.world-system-pair')
    if (!map || !systems || root.querySelector('#civic-life')) return false
    map.insertAdjacentHTML('afterend', markup())
    return true
  }

  if (insert()) return

  const observer = new MutationObserver(() => {
    if (!insert()) return
    observer.disconnect()
  })
  observer.observe(root, { childList:true, subtree:true })
  window.setTimeout(() => observer.disconnect(), 4000)
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
