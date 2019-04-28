import { HUD_SCALE } from 'constants/react'
import { observer } from 'mobx-react-lite'
import Header from 'components/Header'
import React from 'react'
import store from 'store'
import styled from 'styled-components'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-top: none;
  position: absolute;
  top: 0;
  user-select: none;
  width: 360px;
  transform-origin: left top;
  transform: scale(${HUD_SCALE});
`

const Content = styled.div`
  padding: 0 40px;
  padding-bottom: 16px;
`

const Slots = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
`

const Slot = styled.img`
  height: 32px;
  filter: ${props => (!props.isFilled ? 'grayscale(1)' : null)};
  opacity: ${props => (!props.isFilled ? '0.4' : null)};
`

const GoldSection = () => {
  if (store.gold === null) return null

  const goldIcons = []
  for (let i = 0; i < 6; i++) {
    goldIcons.push(i < store.gold)
  }

  return (
    <Container>
      <Header
        text="Gold"
        iconSrc="/static/icons/resources.svg"
        iconSize="22px"
      />
      <Content>
        <Slots>
          {goldIcons.map((isFilled, index) => (
            <Slot
              key={index}
              src="/static/images/gold.svg"
              isFilled={isFilled}
            />
          ))}
        </Slots>
      </Content>
    </Container>
  )
}

export default observer(GoldSection)
