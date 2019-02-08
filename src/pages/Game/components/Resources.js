import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import Label from './Label'
import resourcesImagePath from '../../../icons/resources.svg'
import woodImagePath from '../../../images/wood.png'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border: 1px solid #ddd;
  border-top: none;
  position: absolute;
  top: 0;
  user-select: none;
  width: 290px;
`

const Content = styled.div`
  padding: 0 30px;
  padding-bottom: 12px;
`

const Slots = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
`

const Slot = styled.img`
  height: 32px;
  filter: ${props => (!props.isFilled ? 'grayscale(1)' : null)};
  opacity: ${props => (!props.isFilled ? '0.4' : null)};
`

const WoodSection = ({ wood }) => {
  if (wood === null) return null

  const woodIcons = []
  for (let i = 0; i < 4; i++) {
    woodIcons.push(i < wood)
  }

  return (
    <Container>
      <Header text="Resources" iconSrc={resourcesImagePath} iconSize="22px" />
      <Content>
        <Label>Wood</Label>
        <Slots>
          {woodIcons.map((isFilled, index) => (
            <Slot key={index} src={woodImagePath} isFilled={isFilled} />
          ))}
        </Slots>
      </Content>
    </Container>
  )
}

export default WoodSection
