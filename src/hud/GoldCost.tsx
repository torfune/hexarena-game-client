import styled from 'styled-components'
import React from 'react'
import { COLOR, STATIC } from '../constants/react'
import store from '../store'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  background: ${COLOR.HUD_BACKGROUND};
  top: 0;
  right: 0;
  width: 200px;
  position: absolute;
  user-select: none;
  border-bottom-left-radius: 8px;
  border-bottom: 1px solid ${COLOR.HUD_BORDER};
  border-left: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;
  padding: 16px;

  /* Resolution scaling */
  transform-origin: left top;
  transform: scale(${store.hudScale});
`

const Heading = styled.p`
  text-transform: uppercase;
  margin-bottom: 16px;
  font-weight: 600;
  color: #ccc;
  font-size: 16px;
`

const Icon = styled.img`
  height: 24px;
  filter: invert(1);
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Section = styled.div<{ opacity: number }>`
  opacity: ${props => props.opacity};
  display: flex;
  align-items: center;
  > p {
    margin-left: 6px;
    font-size: 32px;
    font-weight: 500;
    line-height: 24px;
  }
`

const GoldCost = observer(() => {
  if (!store.game || !store.game.player || !store.config) return null

  const { TOWER_COST, CASTLE_COST } = store.config

  const towerAvailable = store.game.player.gold >= TOWER_COST
  const castleAvailable = store.game.player.gold >= CASTLE_COST

  return (
    <Container>
      <Heading>GOLD COST</Heading>

      <Row>
        <Section opacity={towerAvailable ? 1 : 0.4}>
          <Icon src={`${STATIC}/images/tower-icon.png`} />
          <p>{store.config?.TOWER_COST}</p>
        </Section>

        <Section opacity={castleAvailable ? 1 : 0.4}>
          <Icon src={`${STATIC}/images/castle-icon.png`} />
          <p>{store.config?.CASTLE_COST}</p>
        </Section>
      </Row>
    </Container>
  )
})

export default GoldCost
