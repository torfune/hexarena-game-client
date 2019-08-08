import styled from 'styled-components'
import { PRIMARY } from '../../constants/react'

const PlayButton = styled.a<{ background?: string }>`
  display: flex;
  background: ${props => (props.background ? props.background : PRIMARY)};
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 200ms;
  height: 40px;
  text-align: center;
  width: 240px;

  :hover {
    transform: scale(1.05);
  }
`

export default PlayButton
