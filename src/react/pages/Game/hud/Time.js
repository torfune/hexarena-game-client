import React from 'react'
import styled from 'styled-components'
import Header from '../../../shared/Header'
import clockIconSrc from '../../../../assets/icons/clock.svg'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-left-radius: 12px;
  border: 1px solid #ddd;
  border-right: none;
  border-top: none;
  position: absolute;
  top: 0;
  right: 0;
  user-select: none;
  width: 160px;
`

const Content = styled.div`
  padding: 12px 30px;
  font-weight: 600;
  color: #444;
  font-size: 20px;
`

const Time = ({ time }) => {
  if (!time) return null

  const minutes = String(Math.floor(time / 60)).padStart(2, '0')
  const seconds = String(time - minutes * 60).padStart(2, '0')

  return (
    <Container>
      <Header
        text="Time"
        iconSrc={clockIconSrc}
        iconSize="22px"
        red={time < 60}
      />
      <Content>
        {minutes}:{seconds}
      </Content>
    </Container>
  )
}

export default Time
