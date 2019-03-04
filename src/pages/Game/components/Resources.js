import React from 'react'
import styled from 'styled-components'

import Header from './Header'
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
  width: 360px;
`

const Content = styled.div`
  padding: 0 30px;
  padding-bottom: 16px;
`

const Slots = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
`

const Slot = styled.img`
  height: 28px;
  filter: ${props => (!props.isFilled ? 'grayscale(1)' : null)};
  opacity: ${props => (!props.isFilled ? '0.4' : null)};
`

const WoodSection = ({ wood }) => {
  if (wood === null) return null

  const woodIcons = []
  for (let i = 0; i < 6; i++) {
    woodIcons.push(i < wood)
  }

  return (
    <Container>
      <Header text="Wood" iconSrc={resourcesImagePath} iconSize="22px" />
      <Content>
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
