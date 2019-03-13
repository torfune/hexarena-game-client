import React from 'react'
import styled from 'styled-components'
import swordsSrc from '../../../../assets/icons/swords.svg'
import clockSrc from '../../../../assets/icons/clock.svg'
import hammerSrc from '../../../../assets/icons/resources.svg'
import axeSrc from '../../../../assets/icons/axe.svg'
import armySrc from '../../../../assets/icons/army.svg'
import woodSrc from '../../../../assets/images/wood.png'
import { PRIMARY } from '../../../constants'

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.showWood ? 'auto 1px 52px 1px 52px' : 'auto 1px 52px'};
  grid-template-rows: auto 6px auto;
  padding-left: 12px;
  padding-right: 8px;
  margin-bottom: 6px;
`

const ActionType = styled.div`
  display: flex;
  padding-right: 12px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-left: 8px;
  }
`

const Value = styled.div`
  grid-row: 3;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  color: ${props => (props.red ? PRIMARY : '#000')};
  grid-column: ${props => props.column};
`

const Plus = styled.span`
  font-size: 22px;
  font-weight: 600;
  margin-right: -4px;
  position: relative;
  top: -1px;
`

const IconWrapper = styled.div`
  grid-row: 1;
  text-align: center;
  padding-bottom: 4px;
  grid-column: ${props => props.column};
`

const VerticalLine = styled.div`
  grid-column: ${props => props.column};
  grid-row: 1 / span 3;
  background: #ccc;
  height: 100%;
  width: 1px;
`

const HorizontalLine = styled.div`
  grid-column: 1 / span 5;
  grid-row: 2;
  background: #ccc;
  height: 1px;
  width: 100%;
`

const Icon = styled.img`
  height: 20px;
  opacity: ${props => props.opacity};
`

const Structure = styled.div`
  grid-column: 1;
  grid-row: 3;
  font-size: 16px;
  font-style: italic;
  position: relative;
  top: 2px;
`

const NotEnoughWood = styled.div`
  background: #333;
  color: #fff;
  padding: 4px 12px;
  font-weight: 500;
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
      x: clientX + 12,
      y: clientY + 12,
    })
  }
  render() {
    const { x, y, actionPreview, isVisible } = this.state

    let label = null
    let structure = null
    let duration = null
    let notEnoughWood = false
    let woodCost = null

    if (actionPreview) {
      label = actionPreview.label
      structure = actionPreview.structure
      duration = actionPreview.duration
      notEnoughWood = actionPreview.notEnoughWood
      woodCost = actionPreview.woodCost
    }

    return (
      <Container x={x} y={y} isVisible={isVisible}>
        <Grid showWood={!!woodCost}>
          <HorizontalLine />

          <ActionType>
            {renderIconByLabel(label)}
            <h4>{label}</h4>
          </ActionType>
          <Structure>{structure}</Structure>

          <VerticalLine column="2" />

          <IconWrapper column="3">
            <Icon src={clockSrc} />
          </IconWrapper>
          <Value column="3">{duration}</Value>

          {woodCost && (
            <React.Fragment>
              <VerticalLine column="4" />

              <IconWrapper column="5">
                <Icon src={woodSrc} />
              </IconWrapper>
              <Value column="5" red={notEnoughWood}>
                {woodCost}
              </Value>
            </React.Fragment>
          )}
        </Grid>

        {notEnoughWood && <NotEnoughWood>Not enough wood</NotEnoughWood>}
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
