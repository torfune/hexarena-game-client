import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import React from 'react'
import Player from '../../../game/classes/Player'
import Pattern from '../../../components/Pattern'
import { COLOR } from '../../../constants/react'
import shadeColor from '../../../utils/shade'
import getHudScale from '../../../utils/getHudScale'
import store from '../../../store'

const Container = styled.div`
  z-index: 2;
  background: ${COLOR.HUD_BACKGROUND};
  bottom: 0;
  right: calc(319px * ${getHudScale()});
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid ${COLOR.HUD_BORDER};
  border-left: 1px solid ${COLOR.HUD_BORDER};
  border-right: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;
  padding: 16px;

  /* Resolution scaling */
  transform-origin: right bottom;
  transform: scale(${getHudScale()});
`

const GridCSS = css`
  display: grid;
  grid-template-columns: auto 44px 44px 44px;
`

const Heading = styled.p`
  text-transform: uppercase;
  margin-bottom: 12px;
  font-weight: 600;
  color: #ccc;
  font-size: 16px;

  ${GridCSS};
`

const AllyWrapper = styled.div`
  margin-top: 24px;
  margin-bottom: 12px;
  ${GridCSS};
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const Name = styled.p`
  margin-left: 12px;
  margin-right: 24px;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
`

const Icon = styled.img`
  height: 18px;
  opacity: 0.7;
  display: block;
  margin: 0 auto;
  filter: invert(1);
`

const Value = styled.p`
  font-size: 22px;
  text-align: center;
  margin-top: 4px;
  font-weight: 500;
  color: #fff;
`

const Skull = styled.img`
  width: 40px;
  opacity: 0.8;
  filter: invert(1);
`

const DiedText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #ccc;
  text-align: center;
  margin-top: 8px;
  padding: 8px 32px;
  font-style: italic;
`

const GoldButton = styled.div<{ color: string; disabled: boolean }>`
  background: ${props => (props.disabled ? '#ddd' : props.color)};
  padding: 8px;
  text-align: center;
  width: 100%;
  color: ${props => (props.disabled ? '#666' : '#222')};
  margin-top: 20px;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid
    ${props => (props.disabled ? '#ccc' : shadeColor(props.color, -10))};
  border-radius: 4px;
  transition: 200ms;

  :hover {
    transform: ${props => !props.disabled && 'scale(1.05)'};
  }

  :active {
    background: ${props => !props.disabled && shadeColor(props.color, -10)};
  }
`

interface Props {
  ally: Player
  playerGold: number
}
const Ally: React.FC<Props> = ({ ally, playerGold }) => (
  <Container>
    <Heading>
      <p>Your ally</p>
      <Icon src="/static/icons/hexagon.svg" />
      <Icon src="/static/icons/village.svg" />
      <Icon src="/static/icons/gold.svg" />
    </Heading>
    <AllyWrapper>
      <Row>
        {ally.alive ? (
          <Pattern color={ally.pattern} scale={2} />
        ) : (
          <Skull src="/static/icons/skull.svg" />
        )}
        <Name>{ally.name}</Name>
      </Row>

      {ally.alive ? (
        <>
          <Value>{ally.tilesCount}</Value>
          <Value>{ally.economy}</Value>
          <Value>{ally.gold}</Value>
        </>
      ) : (
        <>
          <Value>-</Value>
          <Value>-</Value>
          <Value>-</Value>
        </>
      )}
    </AllyWrapper>

    {ally.alive ? (
      <GoldButton
        color={ally.pattern}
        disabled={playerGold < 10}
        onClick={() => {
          if (store.game) {
            store.game.sendGoldToAlly()
          }
        }}
      >
        Send 10 gold
      </GoldButton>
    ) : (
      <DiedText>Your ally is dead.</DiedText>
    )}
  </Container>
)

export default observer(Ally)
