import GameServerMessage from '../../types/GameServerMessage'

const forests: GameServerMessage = {
  isArray: true,
  instance: true,
  type: {
    id: 'string',
    tileId: 'string',
    treeCount: 'number',
    nextCutAt: 'number',
  },
}

export default forests
