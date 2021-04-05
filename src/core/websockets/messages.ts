// Game Server -> Game Client
export type IncomingMessage =
  | 'actions'
  | 'allianceRequests'
  | 'armies'
  | 'flash'
  | 'forests'
  | 'gameTime'
  | 'goldAnimation'
  | 'incomeAt'
  | 'lastIncomeAt'
  | 'attentionNotification'
  | 'playerId'
  | 'players'
  | 'serverTime'
  | 'startCountdown'
  | 'game'
  | 'spectate'
  | 'status'
  | 'tiles'
  | 'buildings'
  | 'villages'
  | 'spectators'
  | 'ping'
  | 'destroyVillages'
  | 'destroyArmies'
  | 'destroyActions'
  | 'destroyForests'

// Game Client -> Game Server
export type MessageToSend =
  | 'action'
  | 'cancel'
  | 'sendArmy'
  | 'surrender'
  | 'debug'
  | 'close'
  | 'chatMessage'
  | 'pattern'
  | 'request'
  | 'playAsGuest'
  | 'playAsUser'
  | 'sendGold'
  | 'cancelQueue'
  | 'spectate'
  | 'stopSpectate'
  | 'acceptMatch'
  | 'declineMatch'
  | 'spectators'
