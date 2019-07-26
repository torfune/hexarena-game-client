import styled from 'styled-components'
import { BOX_SHADOW, PRIMARY } from '../../constants/react'
import shadeColor from '../../utils/shade'

const PlayButton = styled.a`
  display: flex;
  background: ${PRIMARY};
  color: #fff;
  font-weight: 500;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 200ms;
  width: 160px;
  height: 45px;
  text-align: center;
  /* border: 2px solid ${shadeColor(PRIMARY, -20)}; */

  :hover {
    transform: scale(1.05);
  }
`

export default PlayButton
