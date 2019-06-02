interface GameServerMessage {
  isArray?: boolean
  instance?: boolean
  autoDestroy?: boolean
  type:
    | string
    | {
        [key: string]: string
      }
}

export default GameServerMessage
