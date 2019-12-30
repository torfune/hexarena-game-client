import store from '../store'
import messages from './messages'

class Socket {
  static connected: boolean = false
  static ws?: WebSocket

  static connect(host: string) {
    return new Promise(resolve => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      this.ws = new WebSocket(`${wsProtocol}//${host}`)

      this.ws.addEventListener('message', this.handleMessage)
      this.ws.addEventListener('error', this.handleError)
      this.ws.addEventListener('close', this.handleClose)
      this.ws.addEventListener('open', () => {
        this.connected = true
        console.log(`Connected to the GameServer [${host}]`)
        resolve()
      })
    })
  }
  static handleMessage({ data }: { data: string }) {
    const [key, payload] = data.split('//')
    const handle = messages[key]

    if (handle) {
      handle(payload)
    } else {
      console.warn(`Unhandled message: ${key}`)
    }
  }
  static handleError(event: Event) {
    console.error(event)
    store.error = 'Disconnected'
  }
  static handleClose() {
    this.connected = false
    store.error = 'Disconnected'
  }
  static send(message: string, payload: string = '') {
    if (this.ws) {
      this.ws.send(`${message}//${payload}`)
    }
  }
}

export default Socket
