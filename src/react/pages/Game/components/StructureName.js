import React from 'react'
import styled from 'styled-components'

const Container = styled.div.attrs(({ x, y }) => ({
  style: {
    left: `${x}px`,
    top: `${y}px`,
  },
}))`
  padding: 8px 12px;
  border-radius: 4px;
  background: #fff;
  position: absolute;
  user-select: none;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
`

const StructureName = ({ name, x, y }) => (
  <Container x={x} y={y}>
    {name}
  </Container>
)

export default StructureName
