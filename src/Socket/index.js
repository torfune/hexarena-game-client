import store from '../store'
import api from '../api'
import parse from './parse'
import getItemById from '../utils/getItemById'

class Socket {
  constructor() {
    this.connected = false
  }
  connect = async host => {
    return new Promise(resolve => {
      this.ws = new WebSocket(`ws://${host}`)

      this.ws.addEventListener('open', () => {
        this.connected = true
        resolve()
      })

      this.ws.addEventListener('message', this.handleMessage)
      this.ws.addEventListener('error', this.handleError)
      this.ws.addEventListener('close', this.handleClose)
    })
  }
  handleMessage = ({ data }) => {
    const [message, payload] = data.split('/')

    if (store[message] === undefined) {
      console.warn(`Unhandled message: ${message}`)
      return
    }

    const config = api[message]
    const parsed = parse(payload, config)

    if (!config.class) {
      store[message] = parsed
      return
    }

    if (!config.isArray) {
      console.warn(`Cannot parse: ${message}`)
      return
    }

    if (parsed.length === 0 && !store[message]) {
      store[message] = []
      return
    }

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const keys = Object.keys(fields)
      const item = store[message]
        ? getItemById(store[message], fields.id)
        : null

      if (item) {
        for (let j = 0; j < keys.length; j++) {
          const oldValue = item[keys[j]]
          const newValue = fields[keys[j]]

          if (oldValue !== newValue && oldValue !== undefined) {
            if (item.set) {
              item.set(keys[j], newValue)
            } else {
              throw new Error(`Class for [${message}] needs a "set" method.`)
            }
          }
        }
      } else {
        let validKeys = true

        for (let j = 0; j < keys.length; j++) {
          if (fields[keys[j]] === undefined) {
            console.warn(`${message}: ${keys[j]} is undefined`)
            validKeys = false
            break
          }
        }

        if (!validKeys) continue

        const instance = new config.class(parsed[i])

        if (!instance.id) continue

        if (!store[message]) {
          store[message] = [instance]
        } else {
          store[message].push(instance)
        }
      }
    }

    if (store.changeHandlers[message]) {
      store.changeHandlers[message](store[message], store.previous[message])
      store.previous[message] = store[message]
    }
  }
  handleError = event => {
    console.log(`Messenger: error happened`)
    console.log(event)
  }
  handleClose = () => {
    this.connected = false
    console.log('Messenger: connection closed')
  }
  send = (message, payload) => {
    this.ws.send(`${message}/${payload}`)
  }
  close = () => {
    this.ws.close()
  }
}

export default Socket
