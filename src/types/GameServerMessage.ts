interface GameServerMessage {
  isArray?: boolean
  instance?: boolean
  autoDestroy?: boolean
  allowNull?: boolean
  type:
    | string
    | {
        [key: string]: string
      }
}

export default GameServerMessage
