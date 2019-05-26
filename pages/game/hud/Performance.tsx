import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../../store'

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  z-index: 999;
  padding: 0 16px;
  text-align: center;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-bottom-left-radius: 8px;
`

const Label = styled.p`
  font-weight: 500;
  font-size: 12px;
  color: #444;
  margin-top: 12px;
`

const Value = styled.p`
  margin-bottom: 12px;
`

const Performance = () => (
  <Container>
    <div>
      <Label>FPS</Label>
      <Value>{store.fps}</Value>
    </div>
    <div>
      <Label>PING</Label>
      <Value>{store.ping}</Value>
    </div>
  </Container>
)

export default observer(Performance)
