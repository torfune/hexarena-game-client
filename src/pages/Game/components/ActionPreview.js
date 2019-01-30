import React from 'react'
import styled from 'styled-components'

import swordsSrc from '../../../icons/swords.svg'

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

const Header = styled.div`
  display: flex;
  align-items: center;
`

const Icon = styled.img`
  height: 20px;
`

const Title = styled.h4`
  font-size: 18px;
  margin-left: 8px;

  > span {
    color: #666;
  }
`

const Terrain = styled.p`
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
    let terrain = null
    let duration = null

    if (actionPreview) {
      label = actionPreview.label
      terrain = actionPreview.terrain
      duration = actionPreview.duration
    }

    return (
      <Container x={x} y={y} isVisible={isVisible}>
        <Header>
          <Icon src={swordsSrc} />
          <Title>
            {label} <span>{duration}</span>
          </Title>
        </Header>
        <Terrain>{terrain}</Terrain>
      </Container>
    )
  }
}

export default ActionPreview
