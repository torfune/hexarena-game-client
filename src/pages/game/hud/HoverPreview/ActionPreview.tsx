import styled from 'styled-components'
import ActionType from './ActionLabel'
import { PRIMARY } from '../../../../constants/react'
import React from 'react'

interface ContainerProps {
  showGold: boolean
  showDuration: boolean
}

const getColumns = ({ showGold, showDuration }: ContainerProps) => {
  let columns = 'auto'

  if (showGold) {
    columns += ' 1px 52px'
  }

  if (showDuration) {
    columns += ' 1px 52px'
  }

  return columns
}

const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-columns: ${getColumns};
  grid-template-rows: auto 6px auto;
  padding-left: 12px;
  padding-right: 8px;
  margin-bottom: 6px;
`

interface ValueProps {
  column: string
  color?: string
}

const Value = styled.div<ValueProps>`
  grid-row: 3;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  color: ${props => props.color || '#000'};
  grid-column: ${props => props.column};
`

interface IconWrapperProps {
  column: string
}

const IconWrapper = styled.div<IconWrapperProps>`
  grid-row: 1;
  text-align: center;
  padding-bottom: 4px;
  grid-column: ${props => props.column};
`

interface VerticalLineProps {
  column: string
}

const VerticalLine = styled.div<VerticalLineProps>`
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
  color: #444;
  position: relative;
  top: 2px;
  padding-bottom: 4px;
`
const NotEnoughGold = styled.div`
  background: #333;
  color: #fff;
  padding: 4px 12px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
`

const Icon = styled.img`
  height: 20px;
`

interface Props {
  structure: string
  label?: string
  goldCost?: number
  duration?: string
  notEnoughGold?: boolean
}

const ActionPreview: React.FC<Props> = ({
  goldCost,
  label,
  structure,
  duration,
  notEnoughGold,
}) => {
  return (
    <>
      <Container showGold={!!goldCost} showDuration={!!duration}>
        <HorizontalLine />

        {label && <ActionType label={label} />}

        <Structure>{structure}</Structure>

        {duration && (
          <>
            <VerticalLine column="2" />

            <IconWrapper column="3">
              <Icon src="/static/icons/clock.svg" />
            </IconWrapper>
            <Value column="3">{duration}</Value>
          </>
        )}

        {goldCost && (
          <>
            <VerticalLine column="4" />

            <IconWrapper column="5">
              <Icon src="/static/icons/gold.svg" />
            </IconWrapper>
            <Value column="5" color={notEnoughGold ? PRIMARY : undefined}>
              {goldCost}
            </Value>
          </>
        )}
      </Container>

      {notEnoughGold && <NotEnoughGold>Not enough gold</NotEnoughGold>}
    </>
  )
}

export default ActionPreview
