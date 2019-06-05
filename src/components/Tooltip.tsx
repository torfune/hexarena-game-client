import styled from 'styled-components'
import React from 'react'
import { BOX_SHADOW } from '../constants/react'

const Container = styled.div`
  display: none;
  padding: 12px;
  background: #111;
  position: absolute;
  bottom: 44px;
  border-radius: 5px;
  box-shadow: ${BOX_SHADOW};
`
const Text = styled.p`
  font-weight: 500;
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
`

const Triange = styled.div`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  position: absolute;
  border-top: 8px solid #111;
  bottom: -8px;
  left: calc(50% - 8px);
`

interface Props {
  children: React.ReactNode
}

const Tooltip: React.FC<Props> = ({ children }) => (
  <Container>
    <Text>{children}</Text>
    <Triange />
  </Container>
)

export default Tooltip
