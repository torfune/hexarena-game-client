import React from 'react'
import styled from 'styled-components'
import Hexagon from '../../../../shared/Hexagon'

const Container = styled.div`
  padding-top: 24px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
`

const Name = styled.p`
  margin-left: 16px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
`

const TilesCount = styled.p`
  font-size: 20px;
  margin-left: auto;
  color: #666;
  font-weight: 300;
`

const Ally = ({ ally }) => (
  <Container>
    <Hexagon size="40px" color={ally.pattern} />
    <Name>{ally.name}</Name>
    <TilesCount>{ally.tilesCount}</TilesCount>
  </Container>
)

export default Ally
