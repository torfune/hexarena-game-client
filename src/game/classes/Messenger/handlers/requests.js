import game from '../../..'

const handleRequests = requests => {
  requests = requests.map(r => ({
    startedAt: Date.now() + game.timeDiff,
    timeout: r.timeout,
    sender: game.players.find(({ id }) => id === r.senderId),
    receiver: game.players.find(({ id }) => id === r.receiverId),
  }))

  game.react.setRequests(requests)
}

export default handleRequests
