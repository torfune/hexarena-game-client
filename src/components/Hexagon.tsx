import styled from 'styled-components'
import React from 'react'

interface ContainerProps {
  size: string
  color: string
  margin?: string
}

const Container = styled.div<ContainerProps>`
  width: ${props => props.size};
  height: ${props => props.size};
  position: relative;
  text-align: center;
  transform: rotateZ(90deg);
  margin: ${props => props.margin};

  .hexagon {
    background: ${props => props.color};
    height: 100%;
    width: calc(100% * 0.57735);
    display: inline-block;
    z-index: 0;
  }

  .hexagon:before {
    position: absolute;
    top: 0;
    right: calc((100% / 2) - ((100% * 0.57735) / 2));
    background-color: inherit;
    height: inherit;
    width: inherit;
    content: '';
    transform: rotateZ(60deg);
    z-index: 0;
  }

  .hexagon:after {
    position: absolute;
    top: 0;
    right: calc((100% / 2) - ((100% * 0.57735) / 2));
    background-color: inherit;
    height: inherit;
    width: inherit;
    content: '';
    transform: rotateZ(-60deg);
  }
`

interface Props {
  size: string
  color: string
  margin?: string
}

const Hexagon: React.FC<Props> = props => (
  <Container {...props}>
    <div className="hexagon" />
  </Container>
)

export default Hexagon
