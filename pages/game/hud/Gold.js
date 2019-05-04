import { HUD_SCALE } from 'constants/react'
import { observer } from 'mobx-react-lite'
import { useTransition, animated } from 'react-spring'
import Header from 'components/Header'
import React, { useState, useEffect, useRef } from 'react'
import store from 'store'
import styled from 'styled-components'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-top: none;
  position: absolute;
  top: 0;
  user-select: none;
  width: 360px;
  transform-origin: left top;
  transform: scale(${HUD_SCALE});
  height: 128px;
`

const Content = styled.div`
  padding: 0 40px;
  padding-bottom: 16px;
`

const Slots = styled.div`
  margin-top: 24px;
  display: flex;
`

const Slot = styled(animated.img)`
  height: 32px;
  margin-right: 8px;
  /* filter: ${props => (!props.isFilled ? 'grayscale(1)' : null)};
  opacity: ${props => (!props.isFilled ? '0.4' : null)}; */
`

const GoldSection = () => {
  // if (store.gold === null) return null

  // const goldIcons = []

  // if (store.gold) {
  //   for (let i = 0; i < store.gold; i++) {
  //     goldIcons.push(true)
  //   }
  //   setGold(goldIcons)
  // }

  const [gold, setGold] = useState([])
  const goldRef = useRef(gold)
  goldRef.current = gold

  const transitions = useTransition(gold, item => item.key, {
    from: { transform: 'translate3d(10px,40,10px)' },
    enter: { transform: 'translate3d(10px,-40,10px)' },
    leave: { transform: 'translate3d(-10px,-40,-10px)' },
  })

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyDown = e => {
    if (e.key === 'ArrowUp') {
      setGold([...goldRef.current, { key: Date.now() }])
    }
    if (e.key === 'ArrowDown') {
      setGold(goldRef.current.slice(0, goldRef.current.length - 1))
    }
  }

  return (
    <Container>
      <Header
        text="Gold"
        iconSrc="/static/icons/resources.svg"
        iconSize="22px"
      />
      <Content>
        <Slots>
          {transitions.map(({ props }, key) => (
            <Slot key={key} style={props} src="/static/icons/gold.svg" />
          ))}
        </Slots>
      </Content>
    </Container>
  )
}

export default GoldSection
