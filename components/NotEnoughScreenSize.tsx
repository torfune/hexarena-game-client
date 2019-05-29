import styled from 'styled-components'
import { MIN_SCREEN_WIDTH, MIN_SCREEN_HEIGHT } from '../constants/react'

const Container = styled.div`
  font-size: 32px;
  text-align: center;
  color: #fff;
  margin-top: 128px;

  p {
    margin-top: 48px;
  }
`

interface Props {
  width: number
  height: number
}
const NotEnoughScreenSize: React.FC<Props> = ({ width, height }) => (
  <Container>
    <p>Your device is not supported.</p>
    <p>
      Current: {width}x{height} pixels
    </p>
    <p>
      Required: {MIN_SCREEN_WIDTH}x{MIN_SCREEN_HEIGHT} pixels
    </p>
  </Container>
)

export default NotEnoughScreenSize
