import styled from 'styled-components'
import { animated } from 'react-spring'
import { BOX_SHADOW, COLOR, SHADOW } from '../../constants/constants-react'
import Hexagon from '../Hexagon'
import React from 'react'
import lockIcon from '../../icons/lock.svg'

interface Props {
  style: any
  allPatterns: string[]
  lockedPatterns: string[]
  onPatternSelect: (pattern: string) => void
}
const PatternSelector: React.FC<Props> = ({
  style,
  allPatterns,
  lockedPatterns,
  onPatternSelect,
}) => (
  <Container style={style}>
    <Label>Select color</Label>

    <Patterns>
      {allPatterns.map((pattern) => {
        const locked = lockedPatterns.includes(pattern)

        return (
          <PatternWrapper
            key={pattern}
            locked={locked}
            onClick={() => onPatternSelect(pattern)}
          >
            <Hexagon color={pattern} size="50px" />
            <LockIcon src={lockIcon} locked={locked} />
          </PatternWrapper>
        )
      })}
    </Patterns>
  </Container>
)

const Container = styled(animated.div)`
  top: -40px;
  box-shadow: ${SHADOW.MEDIUM};
  background: ${COLOR.GREY_100};
  position: absolute;
  border-radius: 16px;
  padding: 32px;
  z-index: 2;
  width: 360px;
`
const Patterns = styled.div`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
`
const Label = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${COLOR.GREY_800};
  text-transform: uppercase;
  letter-spacing: 1px;
`

interface PatternWrapperProps {
  locked: boolean
}
const PatternWrapper = styled.div<PatternWrapperProps>`
  margin: 10px 8px 0 8px;
  transition: 150ms;
  position: relative;
  height: 60px;

  :hover {
    z-index: 1;
    transform: ${(props) => !props.locked && 'scale(1.2)'};
  }
`

interface LockIconProps {
  locked: boolean
}
const LockIcon = styled.img<LockIconProps>`
  width: 24px;
  margin: 0 auto;
  filter: invert(1);
  position: relative;
  display: block;
  top: -37px;
  visibility: ${(props) => (props.locked ? 'visible' : 'hidden')};
`

export default PatternSelector
