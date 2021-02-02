import { useEffect, useState } from 'react'
import { PopIn } from '../Animations'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { BOX_SHADOW, PRIMARY, SECONDARY } from '../../constants/react'
import store from '../../core/store'
import React from 'react'
import getWebClientUrl from '../../utils/getWebClientUrl'

let showTimeout: number | null = null

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

  if (!show || !store.game) return null

  return (
    <PopIn>
      <ScreenOverlay />

      <Container>
        <h2>You have lost your capital!</h2>
        <ButtonContainer>
          <a href={getWebClientUrl()}>
            <ContinueButton>Continue</ContinueButton>
          </a>
          <a href={`${getWebClientUrl()}/spectate?gameId=${store.game.id}`}>
            <SpectateButton color={SECONDARY}>Spectate</SpectateButton>
          </a>
        </ButtonContainer>
      </Container>
    </PopIn>
  )
}

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
  z-index: 10;

  h2 {
    font-size: 32px;
    color: #222;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  width: 100%;
`
const ContinueButton = styled.div`
  background: ${PRIMARY};
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 64px;
  border-radius: 4px;
  width: 260px;
  margin: 0 auto;
  transition: 100ms;
  text-align: center;
  border: 2px solid #b93413;
  cursor: pointer;

  :hover {
    transform: scale(1.05);
  }
`
const SpectateButton = styled.div`
  background: #00a8ff;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 6px;
  border-radius: 4px;
  width: 160px;
  margin: 28px auto 0 auto;
  transition: 100ms;
  text-align: center;
  border: 2px solid #0097e6;
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

export default observer(DefeatModal)
