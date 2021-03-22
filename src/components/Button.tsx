import styled from 'styled-components'
import { COLOR, SHADOW } from '../constants/constants-react'
import React, { ButtonHTMLAttributes, FC } from 'react'

interface Props {
  background?: keyof typeof COLOR
  backgroundHover?: keyof typeof COLOR
}
const Button: FC<Props & ButtonHTMLAttributes<any>> = ({
  className,
  children,
  onClick,
  background = 'YELLOW',
  backgroundHover = 'YELLOW_HOVER',
}) => (
  <Container
    className={className}
    onClick={onClick}
    background={COLOR[background]}
    backgroundHover={COLOR[backgroundHover]}
  >
    {children}
  </Container>
)

const Container = styled.button<{
  background: string
  backgroundHover: string
}>`
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
  background: ${(props) => props.background};
  box-shadow: ${SHADOW.SMALL};
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.backgroundHover};
  }
`

export default Button
