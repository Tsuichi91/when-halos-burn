import './styles/site.css'

const base = import.meta.env.BASE_URL
const root = document.querySelector('#archive-root')
const chips = [...document.querySelectorAll('[data-filter]')]
let tracks = []

async function loadTracks() {
  const response = await fetch(`${base}data/tracks.json`)
  if (!response.ok) throw new Error('Failed to load tracks')
  return response.json()
}

function renderTrack(track) {
  return `
    <article class="track-card" data-pov="${track.pov}">
      <div>
        <div class="track-card__top">
          <span>${track.id}</span>
          <span>${track.actLabel}</span>
        </div>
        <h2>${track.title}</h2>
        <p class="track-card__pov">${track.povLabel} POV</p>
      </div>
      ${track.signatureLine ? `<p class="track-card__quote">“${track.signatureLine}”</p>` : ''}
    </article>
  `
}

function applyFilter(filter) {
  document.querySelectorAll('.track-card').forEach((card) => {
    card.hidden = filter !== 'all' && card.dataset.pov !== filter
  })

  chips.forEach((chip) => chip.classList.toggle('is-active', chip.dataset.filter === filter))
}

async function init() {
  try {
    tracks = await loadTracks()
    root.innerHTML = tracks.sort((a, b) => a.order - b.order).map(renderTrack).join('')
    chips.forEach((chip) => chip.addEventListener('click', () => applyFilter(chip.dataset.filter)))
  } catch (error) {
    console.error(error)
    root.innerHTML = '<p class="lede">The Vesper archive could not be loaded.</p>'
  }
}

init()
