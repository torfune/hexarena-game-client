import React from 'react'
import styled from 'styled-components'

import { leaders } from '../../../data'

const Container = styled.div`
  background: #fff;
  bottom: 16px;
  font-family: 'Montserrat';
  padding: 16px 32px;
  position: absolute;
  right: 16px;
  border-radius: 8px;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
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

class Leaderboard extends React.Component {
  render() {
    return (
      <Container>
        <Header>Leaderboard</Header>
        {leaders.map(l => (
          <Leader>
            <p>{l.name}</p>
            <p>{l.points}</p>
          </Leader>
        ))}
      </Container>
    )
  }
}

export default Leaderboard
