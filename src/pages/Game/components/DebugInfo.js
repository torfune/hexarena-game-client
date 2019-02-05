import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: #fff;
  top: 16px;
  font-family: 'Montserrat';
  padding: 16px 32px;
  position: absolute;
  right: 16px;
  border-radius: 8px;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
  user-select: none;
`

const DebugInfo = ({ info }) => {
  if (!info) return null

  return (
    <Container>
      <p>{info}</p>
    </Container>
  )
}

export default DebugInfo
