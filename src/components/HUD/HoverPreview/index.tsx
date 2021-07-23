import styled, { css } from 'styled-components'
import ActionPreview from './ActionPreview'
import { observer } from 'mobx-react-lite'
import PlayerPreview from './PlayerPreview'
import store from '../../../core/store'
import { Pixel } from '../../../types/coordinates'
import React from 'react'
import StructurePreview from './StructurePreview'
import { ActionType } from '../../../core/classes/Action'
import ArmyDragManager from '../../../core/classes/ArmyDragManager'

const ContainerCSS = css`
  position: absolute;
  user-select: none;
  white-space: nowrap;
`

interface ContainerProps {
  cursor: Pixel
}
const Container = styled.div.attrs<ContainerProps>(({ cursor }) => ({
  style: {
    left: `${cursor.x + 8}px`,
    top: `${cursor.y + 8}px`,
  },
}))<ContainerProps>`
  ${ContainerCSS}
`

const HoverPreview = () => {
  if (!store.game || !store.gsConfig) return null

  const { hoveredTile, player, cursor } = store.game

  if (!cursor || !hoveredTile) return null

  if (
    hoveredTile &&
    hoveredTile.owner &&
    (!player || hoveredTile.owner.id !== player.id)
  ) {
    return (
      <Container cursor={cursor}>
        <PlayerPreview player={hoveredTile.owner} />
      </Container>
    )
  }

  let actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING' | null =
    hoveredTile.getActionType({ ignoreGold: true })
  const structure = hoveredTile.getStructureName()

  if (
    hoveredTile.building &&
    hoveredTile.building.army &&
    hoveredTile.owner?.id === store.game.playerId
  ) {
    actionType = 'SEND_ARMY'
  }

  if (ArmyDragManager.active) {
    actionType = null
  }

  if (
    actionType === 'RECRUIT_ARMY' &&
    hoveredTile.building &&
    hoveredTile.building.hp < store.gsConfig.HP[hoveredTile.building.type]
  ) {
    actionType = 'REPAIR_BUILDING'
  }

  if (!actionType) {
    if (hoveredTile.village) {
      // const { VILLAGE_BASE_INCOME, HOUSE_INCOME } = store.gsConfig
      // const villageIncome =
      //   VILLAGE_BASE_INCOME +
      //   (hoveredTile.village.level - 3) * HOUSE_INCOME
      // return (
      //   <Container cursor={cursor}>
      //     <VillagePreview villageIncome={villageIncome} />
      //   </Container>
      // )
      return null
    } else if (
      structure !== 'Plains' &&
      !store.game.supplyLinesEditModeActive
    ) {
      return (
        <Container cursor={cursor}>
          <StructurePreview structure={structure} />
        </Container>
      )
    }
    return null
  }

  return (
    <Container cursor={cursor}>
      <ActionPreview actionType={actionType} tile={hoveredTile} />
    </Container>
  )
}

export default observer(HoverPreview)
