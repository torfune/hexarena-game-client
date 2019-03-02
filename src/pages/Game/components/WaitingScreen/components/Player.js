import React from 'react'
import styled from 'styled-components'
import { BOX_SHADOW } from '../../../../../constants'

const Container = styled.div`
  margin: 0 32px;
  border-radius: 8px;
  padding: 24px 0;
  box-shadow: ${props => (!props.empty ? BOX_SHADOW : null)};
  background: ${props => (!props.empty ? '#fff' : null)};
`

const Name = styled.p`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-top: 40px;
  max-width: 100%;
  padding: 0 16px;
  overflow: hidden;
`

const PatternWrapper = styled.div`
  width: 128px;
  height: 128px;
  text-align: center;
  position: relative;
  display: inline-block;
  top: 16px;
  margin: 0 32px;

  transform: rotateZ(90deg);

  .hexagon {
    background: ${props => props.color || '#3f3f3f'};
    height: 100%;
    width: calc(100% * 0.57735);
    display: inline-block;
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

const Player = ({ name, pattern }) => (
  <Container empty={!name}>
    <PatternWrapper color={pattern}>
      <div className="hexagon" />
    </PatternWrapper>
    <Name>{name || ''}</Name>
  </Container>
)

export default Player
