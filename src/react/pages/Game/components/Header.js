import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 30px;
  align-items: center;
  background: #eee;

  h2 {
    margin-top: 2px;
    text-transform: uppercase;
    color: #444;
    font-size: 18px;
    font-weight: 600;
  }
`

const Icon = styled.img`
  height: ${props => props.size};
  opacity: 0.7;
`

const Header = ({ text, iconSrc, iconSize }) => (
  <Container>
    <h2>{text}</h2>
    <Icon src={iconSrc} size={iconSize} />
  </Container>
)

export default Header
