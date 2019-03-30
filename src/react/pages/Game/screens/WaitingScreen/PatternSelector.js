import React from 'react'
import styled from 'styled-components'
import { animated } from 'react-spring'
import Hexagon from '../../../../shared/Hexagon'
import lockSrc from '../../../../../assets/icons/lock.svg'
import { BOX_SHADOW } from '../../../../constants'

const Container = styled(animated.div)`
  top: 40px;
  left: calc(-150px + 110px);
  box-shadow: ${BOX_SHADOW};
  background: #fff;
  position: absolute;
  border-radius: 40px;
  padding: 20px 0 16px 0;
  z-index: 2;
  width: 300px;
`

const Patterns = styled.div`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
`

const Label = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #444;
  text-transform: uppercase;
`

const PatternWrapper = styled.div`
  margin: 10px 8px 0 8px;
  transition: 150ms;
  position: relative;
  height: 60px;

  :hover {
    z-index: 1;
    transform: ${props => !props.locked && 'scale(1.2)'};
  }
`

const LockIcon = styled.img`
  width: 24px;
  margin: 0 auto;
  filter: invert(1);
  position: relative;
  display: block;
  top: -37px;
  visibility: ${props => (props.locked ? 'visible' : 'hidden')};
`

const PatternSelector = ({
  style,
  allPatterns,
  lockedPatterns,
  onPatternSelect,
}) => (
  <Container style={style}>
    <Label>Select color</Label>

    <Patterns>
      {allPatterns.map(pattern => {
        const locked = lockedPatterns.includes(pattern)

        return (
          <PatternWrapper
            key={pattern}
            locked={locked}
            onClick={() => onPatternSelect(pattern)}
          >
            <Hexagon color={pattern} size="50px" />
            <LockIcon src={lockSrc} locked={locked} />
          </PatternWrapper>
        )
      })}
    </Patterns>
  </Container>
)

export default PatternSelector
