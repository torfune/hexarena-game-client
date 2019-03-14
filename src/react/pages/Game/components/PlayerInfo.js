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

  p {
    font-size: 18px;
    font-weight: 500;
    color: #222;
    margin: 4px 0;
  }
`

const PlayerInfo = ({ player, tilesCount }) => {
  if (!player) return null

  return (
    <Container>
      <Header text="Your Empire" iconSrc={hexagonImagePath} iconSize="20px" />
      <Content>
        <Label>Name</Label>
        <p>{player.name}</p>
        <Label>Population</Label>
        <p>{tilesCount}</p>
      </Content>
    </Container>
  )
}

export default PlayerInfo
