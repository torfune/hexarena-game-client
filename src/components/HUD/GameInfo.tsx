import styled, { css } from 'styled-components'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import store from '../../core/store'
import flagIcon from '../../icons/flag.svg'
import { observer } from 'mobx-react-lite'
import isSpectating from '../../utils/isSpectating'

const GameInfo = observer(() => {
  if (!store.game || store.game.time === null) return null

  const minutes = Math.floor(store.game.time / 60)
  const seconds = store.game.time - minutes * 60
  const formatted = {
    minutes: String(minutes),
    seconds: String(seconds).padStart(2, '0'),
  }

  return (
    <Container>
      <Row>
        <div>
          <Label>Time</Label>
          <Value red={minutes < 1}>
            {formatted.minutes}:{formatted.seconds}
          </Value>
        </div>

        {store.game.spectators ? (
          <div>
            <Label>Spectators</Label>
            <Value>{store.game.spectators}</Value>
          </div>
        ) : null}
      </Row>

      {!isSpectating() && (
        <Button onClick={store.game.surrender.bind(store.game)}>
          <Icon src={flagIcon} />
          <span>Surrender</span>
        </Button>
      )}
    </Container>
  )
})

const Container = styled.div`
  background: ${COLOR.GREY_600}ee;
  top: 0;
  left: 0;
  width: 190px;
  position: absolute;
  user-select: none;
  border-bottom-right-radius: 4px;
  border-bottom: 1px solid ${COLOR.GREY_800};
  border-right: 1px solid ${COLOR.GREY_800};
  overflow: hidden;
  padding: 8px;
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
`
const Button = styled.div`
  background: ${COLOR.GREY_400};
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 0;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;

  :hover {
    background: ${COLOR.GREY_200};
  }
`
const Icon = styled.img`
  filter: invert(1);
  height: 12px;
  margin-right: 8px;
`
const Value = styled.p<{ red?: boolean }>`
  color: #fff;
  font-size: 20px;

  ${(props) =>
    props.red &&
    css`
      color: ${COLOR.RED};
      font-weight: bold;
    `}
`
const Label = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 1px;
  color: #fff;
  opacity: 0.5;
`

export default GameInfo
