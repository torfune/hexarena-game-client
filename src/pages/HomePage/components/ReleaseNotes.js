import React from 'react'
import styled from 'styled-components'

import Heading from './Heading'
import { PRIMARY } from '../../../constants'

const Container = styled.div`
  padding: 96px 128px;
`

const UpdateContainer = styled.div`
  color: #fff;
  margin-top: 32px;
  margin-bottom: 130px;
`

const Version = styled.h3`
  font-size: 32px;
  margin-bottom: 20px;
`

const Point = styled.p`
  font-size: 20px;
  margin-top: 12px;
  position: relative;
  left: 32px;

  ::before {
    content: '';
    width: 10px;
    height: 10px;
    background: ${PRIMARY};
    display: block;
    position: absolute;
    left: -32px;
    top: 8px;
    border-radius: 100%;
  }
`

const updates = [
  {
    version: 'Alpha 0.1.0',
    points: ['Hexagor.io redesign & rework'],
    day: 10,
    month: 4,
  },
]

const ReleaseNotes = () => (
  <Container>
    <Heading>Release notes</Heading>

    {updates.map(update => (
      <UpdateContainer key={update.version}>
        <Version>{update.version}</Version>
        {update.points.map(point => (
          <Point key={point}>{point}</Point>
        ))}
      </UpdateContainer>
    ))}
  </Container>
)

export default ReleaseNotes
