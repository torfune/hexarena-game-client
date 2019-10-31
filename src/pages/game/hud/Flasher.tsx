import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../../../store'
import { useEffect, useState } from 'react'
import React from 'react'

const OPACITY = 0.3

interface ContainerProps {
  opacity: number
}
const Container = styled.div<ContainerProps>`
  position: absolute;
  z-index: 1;
  background: red;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  transition: 100ms;
  opacity: ${props => props.opacity};
`

const Flasher = () => {
  const [opacity, setOpacity] = useState(0)

  if (!store.game) return null

  useEffect(() => {
    if (!store.game || store.game.status !== 'RUNNING' || !store.game.flash) {
      return
    }

    setOpacity(OPACITY)
    setTimeout(() => {
      setOpacity(0)
    }, 100)
  }, [store.game.flash])

  return <Container opacity={opacity} />
}

export default observer(Flasher)
