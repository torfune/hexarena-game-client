import { useEffect, useState } from 'react'
import { PopIn } from '../../../components/Animations'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { BOX_SHADOW, PRIMARY, BLUE } from '../../../constants/react'
import store from '../../../store'

const WIDTH = 700

const Container = styled.div`
  position: absolute;
  top: 200px;
  width: ${WIDTH}px;
  background: #fff;
  text-align: center;
  padding-top: 96px;
  padding-bottom: 64px;
  left: 50vw;
  transform: translateX(-${WIDTH / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;

  h2 {
    font-size: 32px;
    color: #222;
  }
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`

const Button = styled.div`
  background: ${props => props.color};
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 64px;
  border-radius: 4px;
  width: 260px;
  margin: 0 16px;
  transition: 100ms;
  text-align: center;
  box-shadow: ${BOX_SHADOW};
  cursor: pointer;

  :hover {
    transform: scale(1.05);
  }
`

const ScreenOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background: #000000;
  opacity: 0.2;
`

let showTimeout: NodeJS.Timeout | null = null

const DefeatModal = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    showTimeout = setTimeout(() => {
      setShow(true)
    }, 1000)

    return () => {
      if (showTimeout) {
        clearTimeout(showTimeout)
        showTimeout = null
      }
    }
  }, [])

  const handleSpectateClick = () => {
    store.spectating = true
  }

  if (!show) return null

  return (
    <PopIn>
      <ScreenOverlay />

      <Container>
        <h2>You have lost your base!</h2>

        <ButtonRow>
          <a href="/game">
            <Button color={PRIMARY}>Play again</Button>
          </a>

          <Button color={BLUE} onClick={handleSpectateClick}>
            Spectate
          </Button>
        </ButtonRow>
      </Container>
    </PopIn>
  )
}

export default observer(DefeatModal)
