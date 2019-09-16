import store from './store'

const w = window as any
const AudioContext = w.AudioContext || w.webkitAudioContext

const SOUNDS = {
  CAPTURE: {
    url: '/static/sounds/click01.mp3',
    volume: 0.4,
    offset: 0,
  },
  ACTION: {
    url: '/static/sounds/click02.mp3',
    volume: 0.5,
    offset: 0,
  },
  ARMY_SEND: {
    url: '/static/sounds/click03.mp3',
    volume: 1,
    offset: 0,
  },
  VILLAGE_RAID: {
    url: '/static/sounds/coin01.mp3',
    volume: 0.2,
    offset: 0,
  },
  BUILDING: {
    url: '/static/sounds/wave01.mp3',
    volume: 0.4,
    offset: 0.5,
  },
}

class SoundManager {
  static context = new AudioContext() as AudioContext
  static buffers: { [key: string]: AudioBuffer } = {}

  static init() {
    for (const [key, sound] of Object.entries(SOUNDS)) {
      const request = new XMLHttpRequest()
      request.open('GET', sound.url, true)
      request.responseType = 'arraybuffer'
      request.onload = () => {
        this.context.decodeAudioData(request.response, buffer => {
          this.buffers[key] = buffer
        })
      }
      request.send()
    }
  }
  static play(soundKey: keyof typeof SOUNDS) {
    if (!store.settings.sound) return

    const sound = SOUNDS[soundKey]
    const buffer = this.buffers[soundKey]

    if (!sound || !buffer) return

    const source = this.context.createBufferSource()
    source.buffer = buffer
    const node = this.context.createGain()
    node.gain.value = sound.volume
    node.connect(this.context.destination)
    source.connect(node)
    source.start(0, sound.offset)
  }
}

export default SoundManager
