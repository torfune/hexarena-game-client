import styled from 'styled-components'
import ActionPreview from './ActionPreview'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import React from 'react'

const Container = styled.div``

const HoverPreview = () => {
  if (!store.game || !store.config) return null

  const { hoveredTile } = store.game

  if (!hoveredTile || hoveredTile.bedrock) return null

  const actionType = hoveredTile.getActionType()

  return (
    actionType && (
      <Container>
        <ActionPreview actionType={actionType} tile={hoveredTile} />
      </Container>
    )
  )
}

export default observer(HoverPreview)
