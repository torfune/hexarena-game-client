import React from 'react'
import styled from 'styled-components'
import Hexagon from '../../../../shared/Hexagon'
import skullSrc from '../../../../../assets/icons/skull.svg'

const Container = styled.div``

const AllyWrapper = styled.div`
  padding-top: 24px;
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

const Skull = styled.img`
  width: 40px;
  opacity: 0.8;
`

const DiedText = styled.p`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: center;
  margin-top: 8px;
  padding: 8px 32px;
  font-style: italic;
`

const Ally = ({ ally, died }) => (
  <Container>
    <AllyWrapper>
      {died ? (
        <Skull src={skullSrc} />
      ) : (
        <Hexagon size="40px" color={ally.pattern} />
      )}
      <Name>{ally.name}</Name>

      <TilesCount>{died ? '0' : ally.tilesCount}</TilesCount>
    </AllyWrapper>

    <DiedText visible={died}>Your ally is dead.</DiedText>
  </Container>
)

export default Ally
