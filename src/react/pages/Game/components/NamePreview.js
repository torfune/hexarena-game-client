import React from 'react'
import styled from 'styled-components'

import playerSrc from '../../../../assets/icons/player.svg'

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
  display: flex;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
  transition: opacity 0.1s;
  transition-delay: ${({ isVisible }) => (isVisible ? '0.2s' : '0s')};
`

const Label = styled.h4`
  font-size: 18px;
  margin-left: 8px;
  margin-right: 10px;
  font-weight: 600;
`

const Icon = styled.img`
  height: 20px;
`

class NamePreview extends React.Component {
  state = {
    name: null,
    x: null,
    y: null,
    isVisible: false,
  }
  static getDerivedStateFromProps = ({ name }) => {
    if (!name) {
      return {
        isVisible: false,
      }
    }

    return {
      isVisible: true,
      name,
    }
  }
  componentDidMount = () => {
    document.addEventListener('mousemove', this.handleMouseMove)
  }
  componentWillUnmount = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }
  handleMouseMove = ({ clientY, clientX }) => {
    if (!this.state.isVisible) return

    this.setState({
      x: clientX + 16,
      y: clientY + 16,
    })
  }
  render() {
    const { x, y, name, isVisible } = this.state

    return (
      <Container x={x} y={y} isVisible={isVisible}>
        <Icon src={playerSrc} />
        <Label>{name}</Label>
      </Container>
    )
  }
}

export default NamePreview
