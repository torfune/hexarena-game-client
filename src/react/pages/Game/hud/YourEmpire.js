import React from 'react'
import styled from 'styled-components'
import Header from '../../../shared/Header'
import Label from '../../../shared/Label'
import Hexagon from '../../../shared/Hexagon'
import hexagonImagePath from '../../../../assets/icons/hexagon.svg'
import store from '../../../../store'
import { observer } from 'mobx-react-lite'
import { HUD_SCALE } from '../../../constants'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  left: 0;
  height: 200px;
  width: 256px;
  position: absolute;
  user-select: none;
  border-top-right-radius: 8px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  overflow: hidden;
  transform-origin: left bottom;
  transform: scale(${HUD_SCALE});
`

const Content = styled.div`
  padding: 0 30px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
`

const GridField = styled.div`
  grid-row: ${props => props.row};
  grid-column: ${props => props.column};
`

const Text = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #222;
  margin: 4px 0;
`

const PlayerInfo = () => {
  const { player, villages } = store

  if (!player || !villages) return null

  return (
    <Container>
      <Header text="Your Empire" iconSrc={hexagonImagePath} iconSize="20px" />
      <Content>
        <GridField row="1" column="1">
          <Label>Name</Label>
          <Text>{player.name}</Text>
        </GridField>

        <GridField row="2" column="1">
          <Label>Tiles</Label>
          <Text>{player.tilesCount}</Text>
        </GridField>

        <GridField row="1" column="2">
          <Label>Color</Label>
          <Hexagon margin="4px 0 0 0" size="20px" color={player.pattern} />
        </GridField>

        <GridField row="2" column="2">
          <Label>Villages</Label>
          <Text>
            {villages.current}/{villages.limit}
          </Text>
        </GridField>
      </Content>
    </Container>
  )
}

export default observer(PlayerInfo)
