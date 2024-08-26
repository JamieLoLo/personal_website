import { proxy } from 'valtio'

export const windowSizeState = proxy({
  currentWidth: 0,
  currentHeight: 0,

  get mobileMode() {
    return this.currentWidth <= 1024 && this.currentWidth < this.currentHeight
  },
  get phoneMode() {
    return this.currentWidth <= 550
  },
})

if (typeof window !== 'undefined') {
  windowSizeState.currentWidth = window.innerWidth
  windowSizeState.currentHeight = window.innerHeight

  const handleResize = () => {
    windowSizeState.currentWidth = window.innerWidth
    windowSizeState.currentHeight = window.innerHeight
  }

  window.addEventListener('resize', handleResize)

  window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize)
  })
}
