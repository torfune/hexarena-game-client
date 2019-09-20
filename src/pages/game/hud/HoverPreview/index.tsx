import styled, { css } from 'styled-components'
import ActionPreview from './ActionPreview'
import { observer } from 'mobx-react-lite'
import PlayerPreview from './PlayerPreview'
import VillagePreview from './VillagePreview'
import store from '../../../../store'
import { Pixel } from '../../../../types/coordinates'
import React from 'react'
import StructurePreview from './StructurePreview'
import { ActionType } from '../../../../game/classes/Action'

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

  if (!cursor || !hoveredTile || hoveredTile.bedrock) return null

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

  let actionType: ActionType | 'SEND_ARMY' | null = hoveredTile.getActionType(
    true
  )
  const structure = hoveredTile.getStructureName()

  if (hoveredTile.army && hoveredTile.ownerId === store.game.playerId) {
    actionType = 'SEND_ARMY'
  }

  if (store.game.selectedArmyTile) {
    actionType = null
  }

  if (!actionType) {
    if (hoveredTile.village) {
      const { VILLAGE_CAPITAL_INCOME, HOUSE_INCOME } = store.gsConfig
      const villageIncome =
        VILLAGE_CAPITAL_INCOME +
        (hoveredTile.village.houseCount - 3) * HOUSE_INCOME
      return (
        <Container cursor={cursor}>
          <VillagePreview villageIncome={villageIncome} />
        </Container>
      )
    } else if (structure !== 'Plains') {
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
