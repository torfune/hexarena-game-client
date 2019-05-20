import styled from 'styled-components'
import { BOX_SHADOW, PRIMARY } from '../../../constants/react'

const PlayButton = styled.a`
  display: block;
  background: ${PRIMARY};
  color: #fff;
  padding: 8px 0;
  font-weight: 500;
  font-size: 24px;
  box-shadow: ${BOX_SHADOW};
  border-radius: 4px;
  transition: 200ms;
  width: 160px;
  height: 45px;
  text-align: center;

  :hover {
    transform: scale(1.05);
  }
`

export default PlayButton
