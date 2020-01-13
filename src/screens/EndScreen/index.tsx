import styled from 'styled-components'
import { TRANSITION } from '../../constants/react'
import React from 'react'
import Modal from './Modal'
import { useTransition } from 'react-spring'

const EndScreen = () => {
  const transitions = useTransition(true, null, TRANSITION.SCALE)

  return (
    <>
      {transitions.map(
        ({ item, key, props }) => item && <Modal key={key} style={props} />
      )}

      <Backdrop />
    </>
  )
}

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  background: #000;
  opacity: 0.5;
`

export default EndScreen
