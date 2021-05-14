import styled, { css } from 'styled-components'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import store from '../../core/store'
import getHudScale from '../../utils/getHudScale'
import flagIcon from '../../icons/flag.svg'
import { observer } from 'mobx-react-lite'
import isSpectating from '../../utils/isSpectating'

const GameInfo = observer(() => {
  if (!store.game || store.game.time === null) return null

  const minutes = Math.floor(store.game.time / 60)
  const seconds = store.game.time - minutes * 60
  const formatted = {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }

  return (
    <Container>
      <StyledLabel>Remaining time</StyledLabel>
      <TimeText lessThanMinute={minutes < 1}>
        {formatted.minutes}:{formatted.seconds}
      </TimeText>

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
  background: ${COLOR.GREY_600};
  top: 0;
  left: 0;
  width: 200px;
  position: absolute;
  user-select: none;
  border-bottom-right-radius: 8px;
  border-bottom: 1px solid ${COLOR.GREY_800};
  border-right: 1px solid ${COLOR.GREY_800};
  overflow: hidden;
  padding: 16px;

  /* Resolution scaling */
  transform-origin: left top;
  transform: scale(${getHudScale()});
`
const Button = styled.div`
  background: ${COLOR.GREY_400};
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 0px;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;

  :hover {
    background: ${COLOR.GREY_200};
  }
`
const Icon = styled.img`
  filter: invert(1);
  height: 12px;
  margin-right: 8px;
`
const TimeText = styled.p<{ lessThanMinute: boolean }>`
  color: #fff;
  font-size: 24px;

  ${(props) =>
    props.lessThanMinute &&
    css`
      color: ${COLOR.RED};
      font-weight: bold;
    `}
`
const StyledLabel = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1px;
  color: #fff;
  opacity: 0.5;
`

export default GameInfo
