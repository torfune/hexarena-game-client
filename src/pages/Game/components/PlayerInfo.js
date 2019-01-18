import React from 'react'
import styled from 'styled-components'

import { playerInfo } from '../../../data'

const Container = styled.div`
  background: #fff;
  bottom: 16px;
  font-family: 'Montserrat';
  padding: 16px 32px;
  position: absolute;
  left: 16px;
  border-radius: 8px;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
`

const Header = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
`

const PlayerInfo = () => (
  <Container>
    <Header>{playerInfo.name}</Header>
    <p>{playerInfo.tilesCount}</p>
  </Container>
)

export default PlayerInfo
