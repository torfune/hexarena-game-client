import store from '../core/store'

const w = window as any
const AudioContext = w.AudioContext || w.webkitAudioContext
const baseUrl = process.env.PUBLIC_URL + '/sounds'

const isSupported = () => {
  try {
    new AudioContext()
    return true
  } catch {
    return false
  }
}

const SOUNDS = {
  CAPTURE: {
    url: `${baseUrl}/click01.mp3`,
    volume: 0.4,
    offset: 0,
  },
  ACTION: {
    url: `${baseUrl}/click02.mp3`,
    volume: 0.5,
    offset: 0,
  },
  ARMY_SEND: {
    url: `${baseUrl}/click03.mp3`,
    volume: 1,
    offset: 0,
  },
  VILLAGE_RAID: {
    url: `${baseUrl}/coin01.mp3`,
    volume: 0.2,
    offset: 0,
  },
  BUILDING: {
    url: `${baseUrl}/wave01.mp3`,
    volume: 0.4,
    offset: 0.5,
  },
}

class SoundManager {
  static supported = isSupported()
  static context: AudioContext | null = null
  static buffers: { [key: string]: AudioBuffer } = {}

  static init() {
    if (!this.supported) return

    this.context = new AudioContext() as AudioContext

    for (const [key, sound] of Object.entries(SOUNDS)) {
      const request = new XMLHttpRequest()
      request.open('GET', sound.url, true)
      request.responseType = 'arraybuffer'
      request.onload = () => {
        if (!this.context) return
        this.context.decodeAudioData(request.response, (buffer) => {
          this.buffers[key] = buffer
        })
      }
      request.send()
    }
  }
  static play(soundKey: keyof typeof SOUNDS) {
    if (!store.settings.sound || !this.context) return

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
