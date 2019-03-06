import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

import Header from '../Header'
import Action from './Action'
import Slots from './Slots'
import clockSrc from '../../../../icons/clock.svg'

const BottomWrapper = styled(animated.div)`
  position: absolute;
  bottom: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  border: 1px solid #ddd;
  border-top: none;
  user-select: none;
  overflow: hidden;
`

const Content = styled.div`
  padding: 0 24px;
  height: 72px;
  width: 256px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
`

const Actions = props => {
  const [actions, setActions] = useState([])

  useEffect(() => {
    const newActions = [...actions]

    for (let i = newActions.length - 1; i >= 0; i--) {
      if (!props.actions.find(({ id }) => id === newActions[i].id)) {
        newActions.splice(i, 1)
      }
    }

    for (let i = 0; i < props.actions.length; i++) {
      if (!actions.find(({ id }) => id === props.actions[i].id)) {
        newActions.push(props.actions[i])
      }
    }

    setActions(newActions)
  }, [props.actions])

  const bottom = useSpring({
    bottom: props.actions.length > 0 ? '0px' : '-128px',
    config: { tension: 400 },
  })

  return (
    <BottomWrapper style={bottom}>
      <Container>
        <Header text="Actions" iconSrc={clockSrc} iconSize="22px" />

        <Content>
          <Slots />

          {actions.map((action, index) => (
            <Action
              key={action.id}
              index={index}
              type={action.type}
              isActive={index === 0}
            />
          ))}
        </Content>
      </Container>
    </BottomWrapper>
  )
}

export default Actions
