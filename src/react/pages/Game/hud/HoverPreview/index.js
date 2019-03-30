import React from 'react'
import styled from 'styled-components'
import ActionPreview from './ActionPreview'
import StructurePreview from './StructurePreview'

const Container = styled.div.attrs(({ x, y }) => ({
  style: {
    left: `${x}px`,
    top: `${y}px`,
  },
}))`
  padding-top: 8px;
  border-radius: 8px;
  border-top-left-radius: 0;
  background: #fff;
  position: absolute;
  user-select: none;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
  transition: opacity 0.1s;
  transition-delay: ${({ isVisible }) => (isVisible ? '0.4s' : '0s')};
  overflow: hidden;
`

class HoveredTileinfo extends React.Component {
  state = {
    hoveredTileInfo: null,
    x: null,
    y: null,
    isVisible: false,
  }
  static getDerivedStateFromProps = ({ hoveredTileInfo }) => {
    if (!hoveredTileInfo) {
      return {
        isVisible: false,
      }
    }

    return {
      isVisible: true,
      hoveredTileInfo,
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
      x: clientX + 12,
      y: clientY + 12,
    })
  }
  render() {
    const { x, y, hoveredTileInfo, isVisible } = this.state

    let label = null
    let structure = null
    let duration = null
    let notEnoughWood = false
    let woodCost = null

    if (hoveredTileInfo) {
      label = hoveredTileInfo.label
      structure = hoveredTileInfo.structure
      duration = hoveredTileInfo.duration
      notEnoughWood = hoveredTileInfo.notEnoughWood
      woodCost = hoveredTileInfo.woodCost
    }

    return (
      <Container x={x} y={y} isVisible={isVisible}>
        {label ? (
          <ActionPreview
            label={label}
            structure={structure}
            duration={duration}
            notEnoughWood={notEnoughWood}
            woodCost={woodCost}
          />
        ) : (
          <StructurePreview structure={structure} />
        )}
      </Container>
    )
  }
}

export default HoveredTileinfo
