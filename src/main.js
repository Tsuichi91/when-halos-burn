import './styles/site.css'

const halo = document.querySelector('.landing__halo')
const landing = document.querySelector('.landing')

if (halo && landing && window.matchMedia('(pointer: fine)').matches) {
  landing.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 10
    const y = (event.clientY / window.innerHeight - 0.5) * 10
    halo.style.translate = `${x}px ${y}px`
  })

  landing.addEventListener('pointerleave', () => {
    halo.style.translate = '0 0'
  })
}
