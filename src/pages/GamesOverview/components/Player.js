import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-left: 32px;
  display: flex;
`

const Name = styled.p`
  margin-left: 8px;
  color: #333;
  font-weight: 500;
`

const Pattern = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background: ${({ color }) => color};
`

const Player = ({ name, pattern }) => (
  <Container>
    <Pattern color={pattern} />
    <Name>{name}</Name>
  </Container>
)

export default Player
