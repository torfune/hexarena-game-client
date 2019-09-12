import styled from 'styled-components'
import React from 'react'

const Container = styled.div`
  padding: 0 12px;
  background: #fff;
  position: absolute;
  display: flex;
  align-items: center;
  border-radius: 4px;
  left: 0;
  height: 26px;
  top: -32px;
  box-shadow: 2px 0px 8px #000000aa;
  z-index: 2;
`

const Text = styled.p`
  font-weight: 700;
  color: #222;
  font-size: 12px;
  white-space: nowrap;
`

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  position: absolute;
  border-top: 8px solid #fff;
  bottom: -8px;
  left: 12px;
  z-index: 1;
`

interface Props {
  children: React.ReactNode
}
const Tooltip: React.FC<Props> = ({ children }) => (
  <Container>
    <Text>{children}</Text>
    <Triangle />
  </Container>
)

export default Tooltip
