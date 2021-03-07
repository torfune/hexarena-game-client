import store from '../core/store'
import isSpectating from '../utils/isSpectating'
import roundToDecimals from '../core/functions/roundToDecimals'

const MASTER_VOLUME = 0.25

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
  ACTION_CREATE: {
    url: `${baseUrl}/action-create.mp3`,
    volume: 0.2,
    offset: 0,
  },
  ACTION_FAILURE: {
    url: `${baseUrl}/action-failure.mp3`,
    volume: 0.8,
    offset: 0,
  },
  ARMY_CREATE: {
    url: `${baseUrl}/army-create.mp3`,
    volume: 1,
    offset: 0,
  },
  ARMY_SEND: {
    url: `${baseUrl}/army-send.mp3`,
    volume: 0.6,
    offset: 0,
  },
  CAMP_CREATE: {
    url: `${baseUrl}/camp-create.mp3`,
    volume: 0.8,
    offset: 0,
  },
  CASTLE_CREATE: {
    url: `${baseUrl}/castle-create.mp3`,
    volume: 0.8,
    offset: 0,
  },
  DEFEAT: {
    url: `${baseUrl}/defeat.mp3`,
    volume: 1,
    offset: 0,
  },
  GAME_START: {
    url: `${baseUrl}/game-start.mp3`,
    volume: 0.1,
    offset: 0,
  },
  INCOME: {
    url: `${baseUrl}/income.mp3`,
    volume: 0.3,
    offset: 0,
  },
  ARMY_SELECT: {
    url: `${baseUrl}/army-select.mp3`,
    volume: 1,
    offset: 0.1,
  },
  TILE_CAPTURE: {
    url: `${baseUrl}/tile-capture.mp3`,
    volume: 1,
    offset: 0,
  },
  TOWER_CREATE: {
    url: `${baseUrl}/tower-create.mp3`,
    volume: 0.5,
    offset: 0,
  },
  VICTORY: {
    url: `${baseUrl}/victory.mp3`,
    volume: 1,
    offset: 0,
  },
  VILLAGE_CAPTURE: {
    url: `${baseUrl}/village-capture.mp3`,
    volume: 0.5,
    offset: 0,
  },
  VILLAGE_DESTROY: {
    url: `${baseUrl}/village-destroy.mp3`,
    volume: 0.5,
    offset: 0,
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
    if (!store.settings.sound || !this.context || isSpectating()) return

    const sound = SOUNDS[soundKey]
    const buffer = this.buffers[soundKey]

    if (!sound || !buffer) return

    const source = this.context.createBufferSource()
    source.buffer = buffer
    const node = this.context.createGain()
    node.gain.value = roundToDecimals(sound.volume * MASTER_VOLUME, 2)
    node.connect(this.context.destination)
    source.connect(node)
    source.start(0, sound.offset)
  }
}

export default SoundManager
