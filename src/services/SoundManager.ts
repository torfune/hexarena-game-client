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
    url: `${baseUrl}/action-create-b.mp3`,
    volume: 1,
    offset: 0,
    playInSpectate: false,
  },
  ACTION_FAILURE: {
    url: `${baseUrl}/action-failure.mp3`,
    volume: 0.8,
    offset: 0,
    playInSpectate: false,
  },
  ARMY_CREATE: {
    url: `${baseUrl}/army-create.mp3`,
    volume: 1,
    offset: 0,
    playInSpectate: true,
  },
  ARMY_SELECT: {
    url: `${baseUrl}/army-select.mp3`,
    volume: 1,
    offset: 0.1,
    playInSpectate: false,
  },
  ARMY_SEND: {
    url: `${baseUrl}/army-send.mp3`,
    volume: 0.6,
    offset: 0,
    playInSpectate: false,
  },
  ARMY_ARRIVE: {
    url: `${baseUrl}/army-arrive.mp3`,
    volume: 1,
    offset: 0,
    playInSpectate: true,
  },
  CAMP_CREATE: {
    url: `${baseUrl}/camp-create.mp3`,
    volume: 0.3,
    offset: 0,
    playInSpectate: true,
  },
  CASTLE_CREATE: {
    url: `${baseUrl}/castle-create.mp3`,
    volume: 0.8,
    offset: 0,
    playInSpectate: true,
  },
  DEFEAT: {
    url: `${baseUrl}/defeat.mp3`,
    volume: 1,
    offset: 0,
    playInSpectate: false,
  },
  INCOME: {
    url: `${baseUrl}/income.mp3`,
    volume: 0.2,
    offset: 0,
    playInSpectate: false,
  },
  TILE_CAPTURE: {
    url: `${baseUrl}/tile-capture.mp3`,
    volume: 0.4,
    offset: 0,
    playInSpectate: true,
  },
  TILE_LOSE: {
    url: `${baseUrl}/tile-lose.mp3`,
    volume: 0.6,
    offset: 0,
    playInSpectate: false,
  },
  TOWER_CREATE: {
    url: `${baseUrl}/tower-create.mp3`,
    volume: 0.5,
    offset: 0,
    playInSpectate: true,
  },
  VICTORY: {
    url: `${baseUrl}/victory.mp3`,
    volume: 1,
    offset: 0,
    playInSpectate: false,
  },
  VILLAGE_CAPTURE: {
    url: `${baseUrl}/village-capture.mp3`,
    volume: 0.4,
    offset: 0,
    playInSpectate: true,
  },
  VILLAGE_LOSE: {
    url: `${baseUrl}/village-lose.mp3`,
    volume: 0.4,
    offset: 0,
    playInSpectate: false,
  },
  VILLAGE_DESTROY: {
    url: `${baseUrl}/village-destroy.mp3`,
    volume: 0.5,
    offset: 0,
    playInSpectate: false,
  },
}

class SoundManager {
  static initialized = false
  static supported = isSupported()
  static context: AudioContext | null = null
  static buffers: { [key: string]: AudioBuffer } = {}
  static playing: Partial<
    {
      [K in keyof typeof SOUNDS]: boolean
    }
  > = {}

  static init() {
    if (!this.supported || this.initialized) return

    this.context = new AudioContext() as AudioContext
    if (this.context.state === 'suspended') {
      console.warn('Sound auto-play suspended.')
      return
    }

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

    this.initialized = true
  }

  static play(soundKey: keyof typeof SOUNDS) {
    if (
      !this.initialized ||
      !store.settings.sound ||
      !this.context ||
      this.playing[soundKey] ||
      !store.game
    ) {
      return
    }

    const sound = SOUNDS[soundKey]
    const buffer = this.buffers[soundKey]

    if (!sound || !buffer || (isSpectating() && !sound.playInSpectate)) {
      return
    }

    const source = this.context.createBufferSource()
    source.buffer = buffer
    const node = this.context.createGain()
    node.gain.value = roundToDecimals(sound.volume * MASTER_VOLUME, 2)
    node.connect(this.context.destination)
    source.connect(node)
    source.start(0, sound.offset)

    this.playing[soundKey] = true
    source.onended = () => {
      this.playing[soundKey] = false
    }
  }
}

export default SoundManager
