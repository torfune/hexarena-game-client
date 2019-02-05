import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  top: 16px;
  font-family: 'Montserrat';
  font-size: 26px;
  position: absolute;
  right: 16px;
  user-select: none;
  font-weight: 700;
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
