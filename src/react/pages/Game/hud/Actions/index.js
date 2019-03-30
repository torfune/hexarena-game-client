import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Action from './Action'
import Slots from './Slots'
import Header from '../../../../shared/Header'
import clockSrc from '../../../../../assets/icons/clock.svg'

const Container = styled.div`
  position: absolute;
  left: 256px;
  bottom: 0;
  background: rgba(255, 255, 255, 0.92);
  border-top-right-radius: 12px;
  border: 1px solid #ddd;
  user-select: none;
  overflow: hidden;
`

const Content = styled.div`
  padding: 0 24px;
  height: 72px;
  margin: 0 auto;
  display: flex;
  width: 308px;
  align-items: center;
  position: relative;
`

const BottomText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: center;
  padding: 8px 32px;
  font-style: italic;
`

const Actions = props => {
  if (!props.actions) return null

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

  return (
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

      <BottomText>
        Use <span>right click</span> to add Action to queue.
      </BottomText>
    </Container>
  )
}

export default Actions
