import styled from 'styled-components'
import { PRIMARY, SHADOW } from '../../constants/react'

const PlayButton = styled.a<{ background?: string }>`
  display: flex;
  background: ${props => (props.background ? props.background : PRIMARY)};
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 200ms;
  height: 40px;
  text-align: center;
  width: 240px;
  box-shadow: ${SHADOW.BUTTON};

  :hover {
    transform: scale(1.05);
    box-shadow: ${SHADOW.BUTTON_HOVER};
  }
`

export default PlayButton
