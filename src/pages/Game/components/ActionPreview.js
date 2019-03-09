import React from 'react'
import styled from 'styled-components'

import swordsSrc from '../../../icons/swords.svg'
import clockSrc from '../../../icons/clock.svg'
import hammerSrc from '../../../icons/resources.svg'
import axeSrc from '../../../icons/axe.svg'
import armySrc from '../../../icons/army.svg'

const Container = styled.div.attrs(({ x, y }) => ({
  style: {
    left: `${x}px`,
    top: `${y}px`,
  },
}))`
  padding: 8px 12px;
  border-radius: 4px;
  background: #fff;
  position: absolute;
  user-select: none;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
  transition: opacity 0.1s;
  transition-delay: ${({ isVisible }) => (isVisible ? '0.4s' : '0s')};
`

const Plus = styled.span`
  font-size: 22px;
  font-weight: 600;
  margin-right: -4px;
  position: relative;
  top: -1px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
`

const Icon = styled.img`
  height: 20px;
  opacity: ${props => props.opacity};
`

const Label = styled.h4`
  font-size: 18px;
  margin-left: 8px;
  margin-right: 10px;
  font-weight: 600;
`

const Duration = styled.h4`
  font-size: 18px;
  margin-left: 8px;
  font-weight: 500;
  color: #666;
`

const Structure = styled.p`
  margin-top: 4px;
  font-style: italic;
`

class ActionPreview extends React.Component {
  state = {
    actionPreview: null,
    x: null,
    y: null,
    isVisible: false,
  }
  static getDerivedStateFromProps = ({ actionPreview }) => {
    if (!actionPreview) {
      return {
        isVisible: false,
      }
    }

    return {
      isVisible: true,
      actionPreview,
    }
  }
  componentDidMount = () => {
    document.addEventListener('mousemove', this.handleMouseMove)
  }
  componentWillUnmount = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }
  handleMouseMove = ({ clientY, clientX }) => {
    this.setState({
      x: clientX + 16,
      y: clientY + 16,
    })
  }
  render() {
    const { x, y, actionPreview, isVisible } = this.state

    let label = null
    let structure = null
    let duration = null

    if (actionPreview) {
      label = actionPreview.label
      structure = actionPreview.structure
      duration = actionPreview.duration
    }

    return (
      <Container x={x} y={y} isVisible={isVisible}>
        <Header>
          {renderIconByLabel(label)}
          <Label>{label}</Label>

          <Icon src={clockSrc} opacity="0.6" />
          <Duration>{duration}</Duration>
        </Header>
        <Structure>{structure}</Structure>
      </Container>
    )
  }
}

const renderIconByLabel = label => {
  let src = null

  switch (label) {
    case 'Attack':
      src = swordsSrc
      break
    case 'Fortify':
      src = hammerSrc
      break
    case 'Harvest':
      src = axeSrc
      break
    case 'Recruit':
      src = armySrc
      break
    default:
  }

  if (!src) return null

  if (label === 'Recruit') {
    return (
      <div>
        <Plus>+</Plus>
        <Icon src={src} />
      </div>
    )
  }

  return <Icon src={src} />
}

export default ActionPreview
