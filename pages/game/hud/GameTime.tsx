import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { HUD_SCALE } from '../../../constants/react'
import store from '../../../store'

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
`

const Content = styled.div`
  margin: 0 auto;
  background: #555;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: none;
  box-shadow: 0px 2px 6px #00000022;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 4px 0;
  text-align: center;
  user-select: none;
  width: 128px;

  /* Resolution scaling */
  transform-origin: center top;
  transform: scale(${HUD_SCALE});
`

const GameTime = observer(() => {
  if (!store.gameTime) return null

  const minutes = Math.floor(store.gameTime / 60)
  const seconds = store.gameTime - minutes * 60

  const formatted = {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }

  return (
    <Container>
      <Content>
        {formatted.minutes}:{formatted.seconds}
      </Content>
    </Container>
  )
})

export default GameTime
