import React, { Fragment } from 'react'
import styled from 'styled-components'
import ActionType from './ActionLabel'
import { PRIMARY } from 'constants/react'

const getColumns = ({ showGold, showDuration }) => {
  let columns = 'auto'

  if (showGold) {
    columns += ' 1px 52px'
  }

  if (showDuration) {
    columns += ' 1px 52px'
  }

  return columns
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${getColumns};
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
  color: ${props => props.color || '#000'};
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
  padding-bottom: 4px;
`
const NotEnoughGold = styled.div`
  background: #333;
  color: #fff;
  padding: 4px 12px;
  font-weight: 500;
`

const Icon = styled.img`
  height: 20px;
`

const ActionPreview = ({
  goldCost,
  label,
  structure,
  duration,
  notEnoughGold,
}) => {
  return (
    <Fragment>
      <Grid showGold={!!goldCost} showDuration={!!duration}>
        <HorizontalLine />

        <ActionType label={label} />

        <Structure>{structure}</Structure>

        {duration && (
          <React.Fragment>
            <VerticalLine column="2" />

            <IconWrapper column="3">
              <Icon src="/static/icons/clock.svg" />
            </IconWrapper>
            <Value column="3">{duration}</Value>
          </React.Fragment>
        )}

        {goldCost && (
          <React.Fragment>
            <VerticalLine column="4" />

            <IconWrapper column="5">
              <Icon src="/static/icons/gold.svg" />
            </IconWrapper>
            <Value column="5" color={notEnoughGold ? PRIMARY : null}>
              {goldCost}
            </Value>
          </React.Fragment>
        )}
      </Grid>

      {notEnoughGold && <NotEnoughGold>Not enough gold</NotEnoughGold>}
    </Fragment>
  )
}

export default ActionPreview
