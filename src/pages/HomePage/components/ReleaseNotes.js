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
  background: #383838;
  padding: 48px;
  border-radius: 8px;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
`

const Version = styled.h3`
  font-size: 32px;
  margin-bottom: 32px;
`

const Point = styled.p`
  font-size: 20px;
  margin-top: 20px;
  position: relative;
  line-height: 32px;
  padding-left: 32px;

  ::before {
    content: '';
    width: 10px;
    height: 10px;
    background: ${PRIMARY};
    display: block;
    position: absolute;
    left: 0px;
    top: 12px;
    border-radius: 100%;
  }
`

const updates = [
  {
    version: 'Alpha 1.0.0',
    points: [
      'Removed old Camps (replaced with Villages and Mountains).',
      'Removed cooldown on Army recruitment.',
      'Capturing a Mountain also captures neighboring tiles.',
      'Non-neutral Mountains cannot be captured.',
      'Added Villages. Villages spawn on your territory as you grow. Capturing a Village also captures neighboring tiles. Village randomly spawns Forests and Camps.',
      'Improved graphics & animations.',
      'Disabled manual attacks on non-neutral tiles.',
      'Disabled manual attacks on neutral tiles with 2 or more neighboring players.',
      'Added Hitpoints system. Armies can be used to destroy Castles.',
      'Capital has 2 hitpoints.',
      'Removed Action countering system.',
      'Removed Water.',
      'Added Camps with Army. Randomly spawned by Villages.',
      'Gold system replaced with Wood system. You get 1 wood for cutting Forest. Wood is used for building Castles and recruiting Armies.',
      'Every Player starts with 7 tiles.',
      'Lots of other small gameplay and design changes.',
    ],
    day: 22,
    month: 2,
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
