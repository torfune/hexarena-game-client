import { useEffect, useState } from 'react'
import { PopIn } from '../Animations'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { BOX_SHADOW, PRIMARY, SECONDARY } from '../../constants/react'
import store from '../../core/store'
import React from 'react'
import getWebClientUrl from '../../utils/getWebClientUrl'
import Button from '../Button'

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
        <h2>You have lost your capital</h2>
        <a href={getWebClientUrl()}>
          <StyledButton>Continue</StyledButton>
        </a>
      </Container>
    </PopIn>
  )
}

const WIDTH = 500

const Container = styled.div`
  position: absolute;
  top: 200px;
  width: ${WIDTH}px;
  background: #222;
  text-align: center;
  padding-top: 80px;
  padding-bottom: 80px;
  left: 50vw;
  transform: translateX(-${WIDTH / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;
  z-index: 10;

  h2 {
    font-size: 24px;
    color: #fff;
    font-weight: 600;
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
const StyledButton = styled(Button)`
  margin: 48px auto 0 auto;
`

export default observer(DefeatModal)
