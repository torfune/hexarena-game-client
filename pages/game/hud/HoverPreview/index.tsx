import styled, { css } from 'styled-components'
import ActionPreview from './ActionPreview'
import StructurePreview from './StructurePreview'
import { observer } from 'mobx-react-lite'
import NamePreview from './NamePreview'
import store from '../../../../store'
import { useState, useEffect } from 'react'
import getHoveredTileInfo from '../../../../game/functions/getHoveredTileInfo'
import HoveredTileInfo from '../../../../types/HoveredTileInfo'
import { Pixel } from '../../../../types/coordinates'

const ContainerCSS = css`
  padding-top: 8px;
  border-radius: 8px;
  border-top-left-radius: 0;
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

const HoveredTileinfo = () => {
  const { hoveredTile, player } = store

  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [
    hoveredTileInfo,
    setHoveredTileInfo,
  ] = useState<HoveredTileInfo | null>(null)

  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    setCursor({ x: clientX + 12, y: clientY + 12 })
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    if (hoveredTile) {
      const tileInfo = getHoveredTileInfo(hoveredTile)
      setHoveredTileInfo(tileInfo)
    } else {
      setHoveredTileInfo(null)
    }
  }, [hoveredTile])

  if (!hoveredTileInfo || !player) return null

  if (hoveredTile && hoveredTile.owner && hoveredTile.owner.id !== player.id) {
    return (
      <Container cursor={cursor}>
        <NamePreview name={hoveredTile.owner.name} />
      </Container>
    )
  }

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

export default observer(HoveredTileinfo)
