import './styles/world-deep-lore.css'

const root = document.querySelector('#world-app')

const haloLayers = [
  {
    code:'H-01', title:'COUNCIL', role:'POLICY / STRATEGIC AUTHORITY',
    body:'The HALO Council defines security priorities, emergency doctrine and the public interpretation of system-level threats. Its power is strongest where policy, classification and narrative become difficult to separate.'
  },
  {
    code:'H-02', title:'GUARD', role:'FIELD PROTECTION / ENFORCEMENT',
    body:'The Halo Guard turns policy into physical action: protection, containment, investigation and response. Jiwon serves here. Most Guard personnel work from role-limited information rather than complete institutional knowledge.'
  },
  {
    code:'H-03', title:'PROTOCOL', role:'SURVEILLANCE / PREDICTIVE CLASSIFICATION',
    body:'The HALO Protocol links observation, identity, movement and risk analysis. It does not need to feel coercive to be powerful; much of its reach arrives disguised as frictionless civic convenience.'
  },
  {
    code:'H-04', title:'CIVIC GRID', role:'ACCESS / TRANSIT / PUBLIC SYSTEMS',
    body:'Transit, building access, public services and identity verification make HALO part of ordinary life. The system becomes hardest to question precisely where participation feels automatic rather than imposed.'
  },
  {
    code:'H-05', title:'CORE', role:'SYSTEM MEMORY / SEALED ARCHIVE',
    body:'The HALO Core preserves the institutional record beneath layered access. The Blackout evidence survives because the truth was not erased completely; it was made inaccessible to the people most likely to question it.'
  }
]

const eclipseLayers = [
  {
    code:'E-01', title:'CELLS', role:'AUTONOMOUS / COMPARTMENTALIZED',
    body:'Small groups operate with limited knowledge of the wider network. Compartmentalization protects people when one cell is exposed, but it also means no single member holds a complete moral or operational picture.'
  },
  {
    code:'E-02', title:'SHADOW GRID', role:'INFRASTRUCTURE / BLIND SPOTS',
    body:'Old transit lines, service corridors and neglected network segments form a physical and digital layer outside HALO’s cleanest coverage. Eclipse uses what Vesper stopped considering important.'
  },
  {
    code:'E-03', title:'FIELD NETWORK', role:'SCOUTS / COURIERS / SAFE CONTACTS',
    body:'Human movement matters as much as code. Couriers, observers, safe contacts and temporary routes carry information between cells without forcing every exchange through one central system.'
  },
  {
    code:'E-04', title:'OPERATIONS', role:'STRATEGY / TARGETED ACTION',
    body:'Operations are assembled around objectives rather than permanent command. Taeyun is one of Eclipse’s most capable strategists — The Architect — but he is not the movement’s sole leader or owner.'
  },
  {
    code:'E-05', title:'RELEASE NETWORK', role:'VERIFY / DISTRIBUTE / SURVIVE',
    body:'Evidence only matters if it can survive capture and be trusted after release. Redundant handoffs, corroboration and distributed publication prevent one seized device or one compromised person from ending the record.'
  }
]

const layerCards = (items) => items.map((item, index) => `
  <article class="world-structure-card">
    <span>${item.code}</span>
    <div><small>${item.role}</small><h4>${item.title}</h4><p>${item.body}</p></div>
    <i aria-hidden="true">${String(index + 1).padStart(2,'0')}</i>
  </article>
`).join('')

const markup = () => `
  <section class="world-architecture" id="system-architecture" aria-labelledby="world-architecture-title">
    <header class="world-architecture__head">
      <div><span>VESPER SYSTEMS / INTERNAL STRUCTURE</span><h2 id="world-architecture-title">HOW POWER<br />MOVES.</h2></div>
      <p>HALO and Eclipse are not mirror-image factions. One concentrates authority until certainty becomes policy. The other distributes authority until secrecy becomes both protection and risk.</p>
    </header>

    <article class="world-structure world-structure--halo">
      <header class="world-structure__head">
        <div><span>01 / HALO ARCHITECTURE</span><h3>CONTROL MOVES <b>VERTICALLY.</b></h3></div>
        <p>HALO’s strength is coherence. Information rises through increasingly restricted layers; decisions move back down as policy, classification and field action.</p>
      </header>
      <div class="world-structure__flow">${layerCards(haloLayers)}</div>
      <div class="world-structure__logic">
        <article><span>INFORMATION FLOW</span><strong>CIVIC GRID → PROTOCOL → COUNCIL</strong><p>The Guard acts on the resulting priorities while the Core retains the institutional memory beneath separate access controls.</p></article>
        <article><span>WHY IT ENDURES</span><strong>COMPARTMENTALIZATION</strong><p>Most people inside HALO never see enough of the system at once to understand the entire Blackout cover-up. Institutional harm does not require universal corruption.</p></article>
        <article><span>FAILURE MODE</span><strong>CERTAINTY BECOMES SELF-VALIDATING.</strong><p>Once a classification is treated as proof, contradictory evidence can be reclassified as instability, risk or disinformation instead of forcing the system to reconsider itself.</p></article>
      </div>
    </article>

    <article class="world-structure world-structure--eclipse">
      <header class="world-structure__head">
        <div><span>02 / ECLIPSE ARCHITECTURE</span><h3>INFORMATION MOVES <b>LATERALLY.</b></h3></div>
        <p>Eclipse survives by refusing the single center HALO expects to find. Cells share only what they need, routes change, and authority forms around operations rather than permanent command.</p>
      </header>
      <div class="world-structure__flow">${layerCards(eclipseLayers)}</div>
      <div class="world-structure__logic">
        <article><span>INFORMATION FLOW</span><strong>CELL ↔ RELAY ↔ CELL</strong><p>Evidence can move through several people and routes before it reaches a release point. Losing one node should not destroy the whole network.</p></article>
        <article><span>TAEYUN’S POSITION</span><strong>STRATEGIST / NOT SOVEREIGN.</strong><p>The Architect can design operations and manipulate variables, but Eclipse is larger than him. His choices carry influence without becoming automatic movement-wide consent.</p></article>
        <article><span>FAILURE MODE</span><strong>SECRECY ENABLES UNILATERAL CHOICES.</strong><p>The same compartmentalization that protects Eclipse can isolate judgment. Strategy becomes dangerous when people begin to look like access vectors, leverage or acceptable uncertainty.</p></article>
      </div>
    </article>

    <div class="world-architecture__thesis">
      <span>THE SYSTEMIC CONTRADICTION</span>
      <p>HALO can reduce people to categories because it trusts the system too much. Eclipse can reduce people to variables because it trusts the plan too much. Jiwon and Taeyun become dangerous to both logics when they insist on seeing a person where their side expects a role.</p>
    </div>
  </section>
`

const initialize = () => {
  if (!root) return
  const pair = root.querySelector('.world-system-pair')
  if (!pair) {
    const observer = new MutationObserver(() => {
      const target = root.querySelector('.world-system-pair')
      if (!target) return
      observer.disconnect()
      initialize()
    })
    observer.observe(root, { childList:true, subtree:true })
    return
  }
  if (root.querySelector('#system-architecture')) return
  pair.insertAdjacentHTML('afterend', markup())
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once:true })
else initialize()
