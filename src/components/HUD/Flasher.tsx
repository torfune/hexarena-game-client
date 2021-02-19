import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../../core/store'
import { useEffect, useState } from 'react'
import React from 'react'

const Flasher = () => {
  const [visible, setVisible] = useState(false)

  if (!store.game) return null

  useEffect(() => {
    if (!store.game || store.game.status !== 'running' || !store.game.flash) {
      return
    }

    setVisible(true)
    setTimeout(() => {
      setVisible(false)
    }, 100)
  }, [store.game.flash])

  return visible ? <Container /> : null
}

const Container = styled.div`
  position: absolute;
  z-index: 1;
  background: red;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  transition: 100ms;
  opacity: 0.2;
`

export default observer(Flasher)
