import React from 'react'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'

import swordsSrc from '../../../../../assets/icons/swords.svg'
import hammerSrc from '../../../../../assets/icons/resources.svg'
import axeSrc from '../../../../../assets/icons/axe.svg'
import armySrc from '../../../../../assets/icons/army.svg'

const Container = styled.div`
  position: absolute;
  transition: 0.4s;
  width: 52px;
  opacity: ${({ isDestroyed }) => (isDestroyed ? '0' : '1')};
  left: ${({ index }) => (index >= 0 ? `${index * 52 + 24}px` : null)};
`

const Ball = styled.div`
  width: ${props => (props.isActive ? '40px' : '32px')};
  height: ${props => (props.isActive ? '40px' : '32px')};
  background: ${props => (props.isActive ? '#222' : '#666')};
  border-radius: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Icon = styled.img`
  height: ${props => (props.isActive ? '18px' : '14px')};
  filter: invert(1);
`

const Plus = styled.span`
  font-size: 18px;
  font-weight: 500;
  margin-right: -4px;
  position: relative;
  top: -1px;
  color: #fff;
`

const Action = ({ index, type, isDestroyed, isActive }) => {
  const props = useSpring({
    from: { transform: 'translate3d(0, 100px, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' },
    config: { tension: 400 },
  })

  return (
    <Container index={index} isDestroyed={isDestroyed}>
      <animated.div style={props}>
        <Ball isActive={isActive}>{renderIcon(type, isActive)}</Ball>
      </animated.div>
    </Container>
  )
}

const renderIcon = (type, isActive) => {
  let src = null

  switch (type) {
    case 'attack':
      src = swordsSrc
      break
    case 'build':
      src = hammerSrc
      break
    case 'cut':
      src = axeSrc
      break
    case 'recruit':
      src = armySrc
      break
    default:
  }

  if (!src) return null

  if (type === 'recruit') {
    return (
      <div>
        <Plus>+</Plus>
        <Icon src={src} isActive={isActive} />
      </div>
    )
  }

  return <Icon src={src} isActive={isActive} />
}

export default Action
