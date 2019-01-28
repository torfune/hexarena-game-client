import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: #fff;
  bottom: 16px;
  font-family: 'Montserrat';
  padding: 16px 32px;
  position: absolute;
  right: 16px;
  border-radius: 8px;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
  user-select: none;
`

const Header = styled.p`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 16px;
`

const Leader = styled.div`
  display: flex;
  justify-content: space-between;

  p {
    margin: 6px 0;
  }
`

const Leaderboard = ({ leaders }) => (
  <Container>
    <Header>Leaderboard</Header>
    {leaders.map(l => (
      <Leader key={l.name}>
        <p>{l.name}</p>
        <p>{l.tilesCount}</p>
      </Leader>
    ))}
  </Container>
)

export default Leaderboard
