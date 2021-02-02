import styled from 'styled-components'
import { PRIMARY } from '../constants/react'
import React, { ButtonHTMLAttributes, FC } from 'react'

const Button: FC<ButtonHTMLAttributes<any>> = ({ className, children }) => (
  <Container className={className}>{children}</Container>
)

const Container = styled.button`
  width: 256px;
  height: 46px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: 250ms;
  background: ${PRIMARY};
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 24px;
  }
`

export default Button
