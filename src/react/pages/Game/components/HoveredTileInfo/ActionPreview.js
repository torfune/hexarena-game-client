import React, { Fragment } from 'react'
import styled from 'styled-components'
import clockSrc from '../../../../../assets/icons/clock.svg'
import woodSrc from '../../../../../assets/images/wood.png'
import ActionType from './ActionType'
import { PRIMARY } from '../../../../constants'

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.showWood ? 'auto 1px 52px 1px 52px' : 'auto 1px 52px'};
  grid-template-rows: auto 6px auto;
  padding-left: 12px;
  padding-right: 8px;
  margin-bottom: 6px;
`

const Value = styled.div`
  grid-row: 3;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  color: ${props => (props.red ? PRIMARY : '#000')};
  grid-column: ${props => props.column};
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

const Icon = styled.img`
  height: 20px;
`

const ActionPreview = ({
  woodCost,
  label,
  structure,
  duration,
  notEnoughWood,
}) => {
  return (
    <Fragment>
      <Grid showWood={!!woodCost}>
        <HorizontalLine />

        <ActionType label={label} />

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
    </Fragment>
  )
}

export default ActionPreview
