export const actMeta = {
  OPENING: { label: 'OPENING', title: 'THE STORY WE ARE TOLD', description: 'Vesper defines the roles before either man gets the chance to complicate them.' },
  'ACT I': { label: 'ACT I', title: 'ENEMIES', description: 'Recognition becomes fascination. Certainty begins to require effort.' },
  'ACT II': { label: 'ACT II', title: 'TEMPTATION', description: 'Voluntary proximity turns the line from doctrine into a choice.' },
  'ACT III': { label: 'ACT III', title: 'WHAT BECAME REAL', description: 'The plan recedes. Ordinary intimacy makes the consequences harder to contain.' },
  'ACT IV': { label: 'ACT IV', title: 'THE FRACTURE', description: 'Truth arrives without permission and breaks the version of the relationship Jiwon was allowed to know.' },
  'ACT V': { label: 'ACT V', title: 'THE CHOICE', description: 'Evidence becomes action. Love survives only if agency survives with it.' },
  EPILOGUE: { label: 'EPILOGUE', title: 'THE STORY WE CHOOSE', description: 'The city remains complicated. The roles do not.' }
}

export const chapterOrder = ['01A','01B','01C','02','03','04','05','06','07','08','09','10','11','12','13']

export const chapters = {
  '01A': {
    display: '01', code: '01A', track: '01A', title: 'PROLOGUE: THE LINE', titleLines: ['PROLOGUE:', 'THE LINE'],
    act: 'OPENING', perspective: 'NARRATOR', location: 'VESPER CITY', state: 'CLASSIFICATION / THE LINE', relationshipStage: 'THE WORLD BEFORE THEM',
    image: './images/tracks/01a-prologue-the-line/ChatGPT%20Image%209.%20Sept.%202026,%2022_08_26.png', audio: './audio/tracks/01a-prologue-the-line.mp3',
    summary: 'Before either man speaks, Vesper has already decided what they mean.',
    overview: 'Vesper defines safety, order, heroism and threat before Jiwon and Taeyun ever meet. The city presents the line as architecture, policy and common sense — simple only because nobody has yet looked closely at the person standing on the other side.',
    question: 'What happens when a category stops matching the person standing in front of you?',
    quote: 'No line stays simple once you know the face on the other side.',
    scenes: [['01','SYSTEM','In Vesper, safety has a shape.'],['02','SYSTEM','Order has a name: HALO.'],['03','CLASSIFICATION','Everything beyond the approved line becomes easier to name than to understand.']],
    visualLabel: 'VESPER CITY / THE LINE', visualNote: 'The world itself is the subject: beautiful order, older infrastructure beneath it, and a physical boundary that looks absolute only from a distance.',
    notes: [['FUNCTION','World introduction'],['VOICE','Neutral narrator'],['MOTIF','The Line'],['STORY POSITION','Opening event']]
  },
  '01B': {
    display: '02', code: '01B', track: '01B', title: 'FIRST CONTACT', titleLines: ['FIRST', 'CONTACT'],
    act: 'OPENING', perspective: 'TAEYUN', location: 'BORDER DISTRICT', state: 'RECOGNITION / CURIOSITY', relationshipStage: 'RECOGNITION / CURIOSITY',
    image: './images/tracks/01b-first-contact/hero.png', audio: './audio/tracks/01b-first-contact.mp3',
    summary: 'The file told him who Jiwon was. The first choice tells him something else.',
    overview: 'Taeyun enters the encounter already knowing Jiwon by reputation, family and file. Jiwon then gives up a tactical advantage to protect a civilian, forcing Taeyun to reconsider the man HALO records describe — and to refuse the opening he originally expected to exploit.',
    question: 'Why does Taeyun refuse to exploit the opening he was waiting for?',
    quote: 'Maybe the file left something out.',
    scenes: [['01','THE FILE','Taeyun arrives already knowing who Han Jiwon is supposed to be.'],['02','THE OPENING','Jiwon sacrifices the cleaner tactical position because a stranger needs shielding first.'],['03','THE CHOICE','Taeyun could exploit it. He does not. Observation matters more than winning.']],
    visualLabel: 'BORDER DISTRICT / FIRST CONTACT', visualNote: 'Jiwon protects first. Taeyun observes instead of taking the advantage.',
    notes: [['FUNCTION','First meeting'],['POV','Taeyun'],['STAGE','Recognition / Curiosity'],['KEY SHIFT','The file becomes insufficient']]
  },
  '01C': {
    display: '03', code: '01C', track: '01C', title: 'SECOND LOOK', titleLines: ['SECOND', 'LOOK'],
    act: 'OPENING', perspective: 'JIWON', location: 'HALO REVIEW CHAMBER', state: 'ANALYSIS / DOUBT', relationshipStage: 'CURIOSITY / DISRUPTION',
    image: './images/tracks/01c-second-look/hero.png', audio: './audio/tracks/01c-second-look.mp3',
    summary: 'The record is clear. The footage is not.',
    overview: 'Back inside HALO, Jiwon reviews the encounter and finds one detail he cannot reconcile with the official record: Taeyun saw the opening and chose not to take it. Procedure becomes fixation because the contradiction refuses to disappear.',
    question: 'What does a protector do when the evidence contradicts the certainty he was trained to trust?',
    quote: 'You had the opening. Why didn’t you take it?',
    scenes: [['01','THE RECORD','Kang Taeyun is the Architect of the Blackout: a threat with a name, a history and a category.'],['02','THE GAP','The footage returns to the same impossible detail. Taeyun saw the opening.'],['03','THE QUESTION','Jiwon can explain an attack or retreat. He cannot explain a choice that contradicts the record.']],
    visualLabel: 'HALO REVIEW / SECOND LOOK', visualNote: 'HALO remains precise and symmetrical while Jiwon’s certainty begins to fracture inside it.',
    notes: [['FUNCTION','Counter-perspective'],['POV','Jiwon'],['STAGE','Analysis / Doubt'],['KEY SHIFT','Certainty becomes a question']]
  },
  '02': {
    display: '04', code: '02', track: '02', title: 'NO SAINT', titleLines: ['NO', 'SAINT'],
    act: 'ACT I', perspective: 'TAEYUN', location: 'ECLIPSE HUB', state: 'IDEOLOGY / SELF-PORTRAIT', relationshipStage: 'FASCINATION / IDEOLOGICAL CONFLICT',
    image: './images/tracks/02-no-saint/hero.png', audio: './audio/tracks/02-no-saint.mp3',
    summary: 'Truth does not make him innocent.',
    overview: 'Taeyun refuses the comfort of being misunderstood. He names the damage, compromises and manipulation behind the Architect while admitting that Jiwon began as something useful: a key to the archive buried inside HALO.',
    question: 'Can someone pursue the truth without pretending the methods used to reach it were clean?',
    quote: 'I never needed saving.',
    scenes: [['01','THE ARCHITECT','Taeyun separates the Council’s propaganda from the choices he actually made.'],['02','THE KEY','Jiwon entered the plan as access: profile, biometric route, leverage.'],['03','THE LINE','Taeyun refuses innocence and asks who had the authority to draw the categories in the first place.']],
    visualLabel: 'ECLIPSE HUB / NO SAINT', visualNote: 'Taeyun stands inside old infrastructure and restrained technology: dangerous because he chooses his methods, not because he enjoys cruelty.',
    notes: [['FUNCTION','Taeyun ideological portrait'],['POV','Taeyun'],['STAGE','Fascination / Conflict'],['MOTIFS','Truth / Saving / The Line']]
  },
  '03': {
    display: '05', code: '03', track: '03', title: 'HOLD THE LINE', titleLines: ['HOLD', 'THE LINE'],
    act: 'ACT I', perspective: 'JIWON', location: 'HALO SECURITY CORRIDOR', state: 'ATTRACTION / DENIAL', relationshipStage: 'ATTRACTION / DENIAL',
    image: './images/tracks/03-hold-the-line/hero.png', audio: './audio/tracks/03-hold-the-line.mp3',
    summary: 'He knows exactly where the line is. That is becoming the problem.',
    overview: 'Jiwon attempts to turn fixation into procedure. Instead, his attention narrows to Taeyun’s voice, hands and contradictions. The boundary remains perfectly visible; maintaining emotional distance from it requires more effort every time.',
    question: 'When does vigilance become attention — and when does attention become desire?',
    quote: 'I know exactly where the line is.',
    scenes: [['01','PROCEDURE','Jiwon converts the encounter into reports, patterns and tactical review.'],['02','FIXATION','The analysis keeps returning to details that have nothing to do with threat assessment.'],['03','DENIAL','He tells himself distance is discipline while continuing to look toward the boundary.']],
    visualLabel: 'HALO CORRIDOR / HOLD THE LINE', visualNote: 'Controlled framing and HALO geometry hold steady while Jiwon’s gaze becomes the first visible break in the symmetry.',
    notes: [['FUNCTION','Jiwon attraction portrait'],['POV','Jiwon'],['STAGE','Attraction / Denial'],['MOTIFS','Line / Hands / Stay']]
  },
  '04': {
    display: '06', code: '04', track: '04', title: 'CROSSFIRE', titleLines: ['CROSS', 'FIRE'],
    act: 'ACT I', perspective: 'TAEYUN', location: 'BORDER SERVICE CORRIDOR', state: 'PROVOCATION / PROXIMITY', relationshipStage: 'ATTRACTION / DENIAL',
    image: './images/tracks/04-crossfire/hero.png', audio: './audio/tracks/04-crossfire.mp3',
    summary: 'The line stops being theoretical when Jiwon puts him against it.',
    overview: 'Taeyun engineers their second encounter as a controlled provocation. Jiwon disarms and restrains him, but the tactical advantage creates a different problem: neither man can ignore how little distance remains between threat and attraction.',
    question: 'What changes when the person you are supposed to resist is suddenly close enough to hear you breathe?',
    quote: 'Funny. You’re standing on my side of the line.',
    scenes: [['01','THE SETUP','Taeyun chooses the location and expects to control the rhythm of the meeting.'],['02','THE RESTRAINT','Jiwon closes the distance, disarms him and pins one wrist with precise force.'],['03','THE PAUSE','Neither man uses the moment the way doctrine says he should.']],
    visualLabel: 'BORDER INFRASTRUCTURE / CROSSFIRE', visualNote: 'Physical restraint, architectural division and eye contact turn the Line into immediate proximity without crossing into a kiss.',
    notes: [['FUNCTION','Second engineered meeting'],['POV','Taeyun'],['STAGE','Attraction / Denial'],['MOTIFS','Weapons / Hands / Pulse / The Line']]
  },
  '05': {
    display: '07', code: '05', track: '05', title: 'AFTER CURFEW', titleLines: ['AFTER', 'CURFEW'],
    act: 'ACT II', perspective: 'JIWON', location: 'THE OBSERVATORY', state: 'VOLUNTARY DANGER / TEMPTATION', relationshipStage: 'VOLUNTARY DANGER / TEMPTATION',
    image: './images/tracks/05-after-curfew/hero.png', audio: './audio/tracks/05-after-curfew.mp3',
    summary: 'This time, Jiwon comes without orders.',
    overview: 'Jiwon goes to the Observatory by choice. Neutral ground becomes personal when Taeyun reveals that he once belonged to HALO. Jiwon removes one glove; both men let the almost-touch remain unresolved.',
    question: 'What does it mean to cross a boundary when nobody ordered you to approach it?',
    quote: 'I should leave. I don’t.',
    scenes: [['01','THE ARRIVAL','Jiwon enters the Observatory without a mission, arrest order or tactical excuse.'],['02','THE REVEAL','Taeyun admits that HALO was once his system too.'],['03','THE GLOVE','One bare hand closes the emotional distance even though neither man completes the touch.']],
    visualLabel: 'OBSERVATORY / AFTER CURFEW', visualNote: 'Night-blue city light meets one warm practical lamp as Jiwon voluntarily loosens the armor of duty.',
    notes: [['FUNCTION','First voluntary meeting'],['POV','Jiwon'],['STAGE','Temptation'],['MOTIFS','Gloves / Hands / Doors']]
  },
  '06': {
    display: '08', code: '06', track: '06', title: 'UNARMED', titleLines: ['UN', 'ARMED'],
    act: 'ACT II', perspective: 'TAEYUN', location: 'THE OBSERVATORY', state: 'VULNERABILITY / SURRENDER', relationshipStage: 'SURRENDER / DESIRE',
    image: './images/tracks/06-unarmed/hero.png', audio: './audio/tracks/06-unarmed.mp3',
    summary: 'For once, Taeyun stops before control can turn the moment into another plan.',
    overview: 'Injured and pulled into a Blackout memory, Taeyun lets Jiwon see him without performance. Jiwon treats the wound with bare hands. When Taeyun refuses to take the final step for him, Jiwon chooses the first kiss himself.',
    question: 'Can intimacy become real if the person who usually controls the distance finally stops choosing for both of them?',
    quote: 'Because this one can’t belong to the plan.',
    scenes: [['01','THE WOUND','Taeyun arrives injured and less capable of hiding what the Blackout still does to him.'],['02','BARE HANDS','Jiwon treats him without gloves, weapons or institutional distance.'],['03','THE CHOICE','Taeyun stops. Jiwon closes the remaining distance himself.']],
    visualLabel: 'OBSERVATORY / UNARMED', visualNote: 'Warm practical light isolates bare hands, trust and Taeyun’s first visible surrender of control.',
    notes: [['FUNCTION','First kiss chapter'],['POV','Taeyun'],['STAGE','Surrender / Desire'],['MOTIFS','Hands / Choice / Saving']]
  },
  '07': {
    display: '09', code: '07', track: '07', title: 'OFF THE RECORD', titleLines: ['OFF THE', 'RECORD'],
    act: 'ACT III', perspective: 'JIWON', location: 'THE OBSERVATORY', state: 'INTIMACY / VULNERABILITY', relationshipStage: 'INTIMACY / VULNERABILITY',
    image: './images/tracks/07-off-the-record/hero.png', audio: './audio/tracks/07-off-the-record.mp3',
    summary: 'Aegis belongs to daylight. Here, he is simply Jiwon.',
    overview: 'Weeks of stolen time turn the Observatory into a lived-in place: coffee, messages, sleep, familiar touch and weapons left farther away. Jiwon experiences a version of himself that exists outside the role HALO assigned him.',
    question: 'Who is Jiwon when protection stops requiring a uniform, an order and a target?',
    quote: 'Here—I’m just Jiwon.',
    scenes: [['01','ROUTINE','Repeated meetings become coffee, messages and the expectation that the other man will arrive.'],['02','NAMES','Aegis recedes as Taeyun increasingly speaks to Jiwon rather than the role.'],['03','STAYING','Leaving remains possible. Staying begins to feel ordinary.']],
    visualLabel: 'OBSERVATORY / OFF THE RECORD', visualNote: 'The recurring set becomes warmer, softer and visibly lived in without losing the city beyond its windows.',
    notes: [['FUNCTION','Secret relationship'],['POV','Jiwon'],['STAGE','Intimacy'],['MOTIFS','Coffee / Names / Stay']]
  },
  '08': {
    display: '10', code: '08', track: '08', title: 'OFF SCRIPT', titleLines: ['OFF', 'SCRIPT'],
    act: 'ACT III', perspective: 'TAEYUN', location: 'THE OBSERVATORY', state: 'LOVE / AVOIDANCE', relationshipStage: 'LOVE / AVOIDANCE',
    image: './images/tracks/08-off-script/hero.png', audio: './audio/tracks/08-off-script.mp3',
    summary: 'The plan is no longer the danger. The truth is.',
    overview: 'A mundane moment tells Taeyun what danger never could: Jiwon has become real to him. His strategy has already failed emotionally. The remaining threat is the truth about Seojun that he still cannot make himself surrender.',
    question: 'What happens when the manipulator falls in love before he has confessed what the manipulation was built on?',
    quote: 'And that’s the worst lie I’ve told you yet.',
    scenes: [['01','ORDINARY','A small domestic moment makes the relationship feel more real than any confrontation did.'],['02','RECOGNITION','Taeyun realizes he is no longer protecting a plan from Jiwon; he is protecting himself from Jiwon’s judgment.'],['03','TOMORROW','He almost tells the truth and delays it one more time.']],
    visualLabel: 'OBSERVATORY / OFF SCRIPT', visualNote: 'Warmth fills the familiar room while a colder fracture in reflection foreshadows the truth still being withheld.',
    notes: [['FUNCTION','Taeyun realizes love first'],['POV','Taeyun'],['STAGE','Love / Avoidance'],['MOTIFS','Truth / Names / Files']]
  },
  '09': {
    display: '11', code: '09', track: '09', title: 'FAULT LINE', titleLines: ['FAULT', 'LINE'],
    act: 'ACT IV', perspective: 'JIWON', location: 'THE OBSERVATORY', state: 'BETRAYAL / COLLAPSE', relationshipStage: 'BETRAYAL / COLLAPSE',
    image: './images/tracks/09-fault-line/hero.png', audio: './audio/tracks/09-fault-line.mp3',
    summary: 'The betrayal is not that every feeling was false. It is that Jiwon was never given the whole choice.',
    overview: 'Jiwon finds the dossier: psychological profiling, biometric access, Seojun and the architecture of Taeyun’s original plan. The intimacy remains real enough to hurt precisely because its beginning was not offered to Jiwon honestly.',
    question: 'Can love repair a relationship after one person discovers that his agency was part of the original strategy?',
    quote: 'Not at first.',
    scenes: [['01','THE DOSSIER','Jiwon sees himself reduced to profile, access route and leverage.'],['02','THE QUESTION','When did I stop being part of the plan? Taeyun cannot give him a clean answer.'],['03','THE BREAK','Jiwon leaves and refuses the touch that once meant safety.']],
    visualLabel: 'OBSERVATORY / FAULT LINE', visualNote: 'The warm neutral ground fractures into glass, doorframes, warning red and physical separation.',
    notes: [['FUNCTION','Betrayal'],['POV','Jiwon'],['STAGE','Collapse'],['PROTECTED LINES','Not at first. / Don’t touch me.']]
  },
  '10': {
    display: '12', code: '10', track: '10', title: 'DON’T COME BACK', titleLines: ['DON’T', 'COME BACK'],
    act: 'ACT IV', perspective: 'TAEYUN', location: 'ECLIPSE HUB', state: 'ABSENCE / SEPARATION', relationshipStage: 'ABSENCE / SEPARATION',
    image: './images/tracks/10-dont-come-back/hero.png', audio: './audio/tracks/10-dont-come-back.mp3',
    summary: 'Taeyun sends no argument for love. Only the archive and the right to decide.',
    overview: 'Taeyun does not chase Jiwon. He deletes routes, removes him from the Halo Core plan and opens every file, including evidence that condemns his own choices. The only message that matters is verifiable evidence.',
    question: 'What does accountability look like when apology cannot restore the choice you already took away?',
    quote: 'Check it yourself.',
    scenes: [['01','THE ABSENCE','Taeyun returns to Eclipse without Jiwon and does not follow him.'],['02','THE ARCHIVE','He opens the files without curating out the evidence against himself.'],['03','THE MESSAGE','He sends the record and asks for no trust in return.']],
    visualLabel: 'ECLIPSE HUB / DON’T COME BACK', visualNote: 'Large negative space turns Jiwon’s absence into the dominant shape of the frame.',
    notes: [['FUNCTION','Separation / evidence transfer'],['POV','Taeyun'],['STAGE','Absence'],['MOTIFS','Truth / Doors / Agency']]
  },
  '11': {
    display: '13', code: '11', track: '11', title: 'THE LINE — REPRISE', titleLines: ['THE LINE', 'REPRISE'],
    act: 'ACT V', perspective: 'JIWON', location: 'HALO VERIFICATION CHAMBER', state: 'TRUTH / CHOICE', relationshipStage: 'TRUTH / CHOICE',
    image: './images/tracks/11-the-line-reprise/hero.png', audio: './audio/tracks/11-the-line-reprise.mp3',
    summary: 'Jiwon verifies the truth himself — and refuses to inherit anyone else’s conclusion.',
    overview: 'Jiwon checks the archive independently, attempts the institutional route and watches HALO refuse its own evidence. He reclaims Aegis as a shield chosen by him rather than a role owned by the Council, then returns to Taeyun by choice.',
    question: 'What remains of duty when the institution that defined it refuses the truth?',
    quote: 'Show me the Core.',
    scenes: [['01','VERIFY','Jiwon checks the archive without relying on Taeyun’s interpretation.'],['02','REFUSAL','HALO rejects evidence that threatens the story it needs to preserve.'],['03','AEGIS','Jiwon chooses what the shield means and crosses the line on his own terms.']],
    visualLabel: 'HALO VERIFICATION / THE LINE — REPRISE', visualNote: 'The architecture remains beautiful, but Jiwon’s deliberate step across its boundary breaks the old symmetry.',
    notes: [['FUNCTION','Independent verification'],['POV','Jiwon'],['STAGE','Truth / Choice'],['MOTIFS','Aegis / Line / Names']]
  },
  '12': {
    display: '14', code: '12', track: '12', title: 'WHEN HALOS BURN', titleLines: ['WHEN HALOS', 'BURN'],
    act: 'ACT V', perspective: 'TAEYUN', location: 'HALO CORE', state: 'EQUALITY / LOVE', relationshipStage: 'EQUALITY / LOVE',
    image: './images/tracks/12-when-halos-burn/hero.png', audio: './audio/tracks/12-when-halos-burn.mp3',
    summary: 'The archive opens. Love survives only because neither man gets to choose for the other.',
    overview: 'Jiwon and Taeyun enter Halo Core side by side and release the complete archive. When Taeyun falls back into control disguised as protection, Jiwon draws the final boundary: love does not cancel agency.',
    question: 'Can they stand together without turning protection, truth or love into another form of control?',
    quote: 'I love you. That doesn’t mean you get to choose for me.',
    scenes: [['01','THE CORE','They enter as equals, neither leading the other into the decision.'],['02','THE UPLOAD','The complete archive leaves HALO’s control and becomes public evidence.'],['03','THE BOUNDARY','Love is spoken only after Jiwon makes clear that staying is his choice.']],
    visualLabel: 'HALO CORE / WHEN HALOS BURN', visualNote: 'Cold civic geometry gives way to gold and amber as both men occupy the frame as equal subjects.',
    notes: [['FUNCTION','Finale / archive release'],['POV','Taeyun'],['STAGE','Equality / Love'],['MOTIFS','Halo / Truth / Stay / Choice']]
  },
  '13': {
    display: '15', code: '13', track: '13', title: 'AFTERLIGHT', titleLines: ['AFTER', 'LIGHT'],
    act: 'EPILOGUE', perspective: 'NARRATOR', location: 'VESPER OUTSKIRTS', state: 'AFTERMATH / MORNING', relationshipStage: 'AFTERMATH / MORNING',
    image: './images/tracks/13-afterlight/hero.png', audio: './audio/tracks/13-afterlight.mp3',
    summary: 'The truth changes the morning. It does not repair the city overnight.',
    overview: 'Investigations begin, reputations fracture and accountability remains complicated. Jiwon and Taeyun leave Vesper temporarily without uniform, coat or public roles between their names. The old line has become a horizon rather than a wall.',
    question: 'What does staying mean when there is no role left to hide inside?',
    quote: 'I’m still here.',
    scenes: [['01','MORNING','Vesper wakes with the archive public and no simple replacement story ready.'],['02','AFTERMATH','The city remains standing while institutions, reputations and responsibility begin to shift.'],['03','HORIZON','Jiwon and Taeyun leave without uniforms, titles or certainty — but not without each other.']],
    visualLabel: 'VESPER OUTSKIRTS / AFTERLIGHT', visualNote: 'Dawn replaces the hard boundary with an open horizon; the city is still present, but no longer defines the two men in the foreground.',
    notes: [['FUNCTION','Epilogue'],['VOICE','Narrator'],['STAGE','Aftermath / Morning'],['PROTECTED LINE','I’m still here.']]
  }
}

export const chapterList = chapterOrder.map((code) => chapters[code])

export const getChapterHref = (code) => `./chapter.html?chapter=${encodeURIComponent(code)}`
