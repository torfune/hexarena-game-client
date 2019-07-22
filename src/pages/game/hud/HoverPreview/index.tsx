import styled, { css } from 'styled-components'
import ActionPreview from './ActionPreview'
import StructurePreview from './StructurePreview'
import { observer } from 'mobx-react-lite'
import PlayerPreview from './PlayerPreview'
import store from '../../../../store'
import { Pixel } from '../../../../types/coordinates'
import React from 'react'

const ContainerCSS = css`
  padding-top: 8px;
  border-radius: 8px;
  border-top-left-radius: 4px;
  background: #fff;
  position: absolute;
  user-select: none;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`

interface ContainerProps {
  cursor: Pixel
}
const Container = styled.div.attrs<ContainerProps>(({ cursor }) => ({
  style: {
    left: `${cursor.x}px`,
    top: `${cursor.y}px`,
  },
}))<ContainerProps>`
  ${ContainerCSS}
`

const HoverPreview = () => {
  if (!store.game) return null

  const { hoveredTile, player, cursor } = store.game

  if (!cursor) return null

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

  // store.game.updateHoveredTileInfo()
  const { hoveredTileInfo } = store.game

  if (!hoveredTileInfo) return null

  return (
    <Container cursor={cursor}>
      {hoveredTileInfo.label ? (
        <ActionPreview {...hoveredTileInfo} />
      ) : (
        <StructurePreview structure={hoveredTileInfo.structure} />
      )}
    </Container>
  )
}

export default observer(HoverPreview)
