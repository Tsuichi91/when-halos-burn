import './styles/site.css'

const base = import.meta.env.BASE_URL
const root = document.querySelector('#story-root')

async function loadJson(path) {
  const response = await fetch(`${base}data/${path}`)
  if (!response.ok) throw new Error(`Failed to load ${path}`)
  return response.json()
}

function renderTrack(track) {
  return `
    <article class="story-track" data-pov="${track.pov}">
      <div class="story-track__id">${track.id}</div>
      <div>
        <h3>${track.title}</h3>
        <p class="story-track__meta">${track.povLabel} POV · ${track.relationshipStage}</p>
        <p class="story-track__summary">${track.summary}</p>
        ${track.signatureLine ? `<blockquote>“${track.signatureLine}”</blockquote>` : ''}
      </div>
    </article>
  `
}

async function init() {
  try {
    const [acts, tracks] = await Promise.all([
      loadJson('acts.json'),
      loadJson('tracks.json')
    ])

    root.innerHTML = acts.map((act) => {
      const actTracks = tracks.filter((track) => track.act === act.id).sort((a, b) => a.order - b.order)
      return `
        <section class="act-block" data-theme="${act.theme}">
          <p class="act-kicker">${act.title}</p>
          <h2 class="act-title">${act.subtitle}</h2>
          ${act.statement ? `<p class="lede">${act.statement}</p>` : ''}
          <div>${actTracks.map(renderTrack).join('')}</div>
        </section>
      `
    }).join('')
  } catch (error) {
    console.error(error)
    root.innerHTML = '<p class="lede">The Vesper archive could not be loaded.</p>'
  }
}

init()
