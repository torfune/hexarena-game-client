import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 100%;
`

const Slot = styled.div`
  width: 52px;
`

const Ball = styled.div`
  width: 16px;
  height: 16px;
  background: #ccc;
  border-radius: 100%;
  margin: 0 auto;
`

const Slots = () => (
  <Container>
    {[0, 1, 2, 3].map(i => (
      <Slot key={i}>
        <Ball />
      </Slot>
    ))}
  </Container>
)

export default Slots
