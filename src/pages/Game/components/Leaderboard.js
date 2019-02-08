import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import crownImagePath from '../../../icons/crown.svg'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  right: 0;
  min-height: 256px;
  width: 260px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  overflow: hidden;
`

const Content = styled.div`
  padding: 8px 30px;
`

const Leader = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 8px;

  p {
    color: #222;
    margin: 8px 0;
    font-weight: 500;

    span:first-child {
      padding-right: 8px;
    }
  }
`

const Leaderboard = ({ leaders }) => {
  if (!leaders.length) return null

  return (
    <Container>
      <Header text="Leaderboard" iconSrc={crownImagePath} iconSize="24px" />
      <Content>
        {leaders.map((l, i) => (
          <Leader key={l.name}>
            <p>
              <span>{i + 1}.</span>
              <span>{l.name}</span>
            </p>
            <p>{l.tilesCount}</p>
          </Leader>
        ))}
      </Content>
    </Container>
  )
}

export default Leaderboard
