import styled from 'styled-components'
import React from 'react'
import { ActionType } from '../../game/classes/Action'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import GameServerConfig from '../../types/GameServerConfig'
import Tile from '../../game/classes/Tile'

const Container = styled.div`
  display: flex;
  align-items: center;
`
const Icon = styled.img`
  height: 34px;
  filter: invert(1);
`

interface Props {
  actionType: ActionType | 'SEND_ARMY'
  tile: Tile
}
const ActionPreview: React.FC<Props> = ({ actionType, tile }) => {
  if (!store.game || !store.config || !store.game.player) return null

  const cost = getActionCost(
    actionType,
    store.config,
    tile.forest ? tile.forest.treeCount : 0
  )
  if (!cost) return null

  const gold = store.game.player.gold
  const enoughGold = gold >= cost

  return (
    <Container>{enoughGold && <Icon src="/images/tower-icon.png" />}</Container>
  )
}

// const getActionLabel = (actionType: ActionType | 'SEND_ARMY' | 'REPAIR') => {
//   if (!store.game || !store.game.hoveredTile) return

//   switch (actionType) {
//     // case 'CAPTURE':
//     //   const structure = store.game.hoveredTile.getStructureName()
//     //   return `Capture ${structure || 'Tile'}`
//     // case 'CAMP':
//     //   return 'Build Camp'
//     case 'TOWER':
//       return 'Build Tower'
//     case 'CASTLE':
//       return 'Build Castle'
//     // case 'SEND_ARMY':
//     //   return 'Send army'
//   }
// }

// const getActionIcon = (actionType: ActionType | 'SEND_ARMY' | 'REPAIR') => {
//   if (!store.game || !store.game.hoveredTile) return

//   switch (actionType) {
//     // case 'CAPTURE':
//     //   const structure = store.game.hoveredTile.getStructureName()
//     //   return `/static/images/${
//     //     structure ? structure.toLowerCase() : 'tile'
//     //   }-icon.png`
//     // case 'CAMP':
//     //   return '/static/images/camp-icon.png'
//     case 'TOWER':
//       return '/static/images/tower-icon.png'
//     case 'CASTLE':
//       return '/static/images/castle-icon.png'
//     case 'REPAIR':
//       return '/static/images/hpFill.png'
//     // case 'SEND_ARMY':
//     //   return '/static/icons/army.svg'
//   }
// }

const getActionCost = (
  actionType: ActionType | 'SEND_ARMY',
  config: GameServerConfig,
  treeCount: number
) => {
  switch (actionType) {
    // case 'CAPTURE':
    //   if (!store.game || !store.game.hoveredTile) return 1
    //   return store.game.hoveredTile.captureCost()
    // case 'CAMP':
    //   return config.CAMP_COST - treeCount
    case 'TOWER':
      return config.TOWER_COST - treeCount
    case 'CASTLE':
      return config.CASTLE_COST
    // case 'SEND_ARMY':
    //   return 0
  }
}

// const getActionDescription = (
//   actionType: ActionType | 'SEND_ARMY' | 'REPAIR'
// ) => {
//   if (!store.game) return null

//   if (actionType === 'SEND_ARMY' && !store.game.selectedArmyTile) {
//     return 'Drag & drop to send army'
//   }

//   return 'Click to start'
// }

export default observer(ActionPreview)
