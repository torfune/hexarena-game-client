import styled from 'styled-components'
import React from 'react'

interface ContainerProps {
  size: string
  thickness: string
  color: string
}
const Container = styled.div<ContainerProps>`
  position: relative;
  width: ${props => props.size};
  height: ${props => props.size};

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${props => props.size};
    height: ${props => props.size};
    border: ${props => `${props.thickness} solid ${props.color}`};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.color} transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`

interface Props {
  size: string
  thickness: string
  color: string
  className?: string
}
const Spinner: React.FC<Props> = ({ size, thickness, color, className }) => (
  <Container
    size={size}
    thickness={thickness}
    color={color}
    className={className}
  >
    <div />
    <div />
    <div />
    <div />
  </Container>
)

export default Spinner
