import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import Label from './Label'
import hexagonImagePath from '../../../../assets/icons/hexagon.svg'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  left: 0;
  height: 200px;
  width: 290px;
  position: absolute;
  user-select: none;
  border-top-right-radius: 8px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  overflow: hidden;
`

const Content = styled.div`
  padding: 0 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
`

const Column = styled.div`
  :last-child {
    justify-self: right;
  }
`

const Text = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #222;
  margin: 4px 0;
`

const Pattern = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin: 8px auto;
`

const PlayerInfo = ({ player, tilesCount }) => {
  if (!player) return null

  return (
    <Container>
      <Header text="Your Empire" iconSrc={hexagonImagePath} iconSize="20px" />
      <Content>
        <Column>
          <Label>Name</Label>
          <Text>{player.name}</Text>
          <Label>Population</Label>
          <Text>{tilesCount}</Text>
        </Column>
        <Column>
          <Label>Color</Label>
          <Pattern color={player.pattern} />
        </Column>
      </Content>
    </Container>
  )
}

export default PlayerInfo
