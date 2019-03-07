import React from 'react'
import styled from 'styled-components'

const TopWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  font-size: 20px;
  text-align: center;
  user-select: none;
  width: 400px;
  font-weight: 400;
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  padding: 16px 32px;
  border: 1px solid #ddd;
`

const FinishCountdown = ({ finishSeconds }) => {
  if (finishSeconds === null) return null

  return (
    <TopWrapper>
      <Container>
        <p>Game ends in {finishSeconds} seconds.</p>
        <p>Player with more tiles wins!</p>
      </Container>
    </TopWrapper>
  )
}

export default FinishCountdown
