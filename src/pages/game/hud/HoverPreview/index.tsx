import styled, { css } from 'styled-components'
import ActionPreview from './ActionPreview'
import { observer } from 'mobx-react-lite'
import PlayerPreview from './PlayerPreview'
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
  if (!store.game) return null

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

  let actionType: ActionType | 'SEND_ARMY' | null = hoveredTile.getActionType(
    true
  )
  const structure = hoveredTile.getStructureName()

  if (
    (hoveredTile.army && hoveredTile.ownerId === store.game.playerId) ||
    store.game.selectedArmyTile
  ) {
    actionType = 'SEND_ARMY'
  }

  if (!actionType) {
    return (
      <Container cursor={cursor}>
        {structure !== 'Plains' ? (
          <StructurePreview structure={structure} />
        ) : null}
      </Container>
    )
  }

  return (
    <Container cursor={cursor}>
      <ActionPreview actionType={actionType} tile={hoveredTile} />
    </Container>
  )
}

export default observer(HoverPreview)
