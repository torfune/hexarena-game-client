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

const EditorCredits = styled.p`
  text-align: right;
  font-style: italic;

  span {
    font-weight: 600;
    font-size: 18px;
    color: ${PRIMARY};
  }
`

const updates = [
  {
    version: 'Alpha 1.0.0',
    points: [
      'Every Player starts with 7 tiles, with Capital at center.',
      'Added Hit Points System. Capitals have 2 hit points.',
      'Removed Camps (replaced with Villages and Mountains).',
      'Removed cooldown on Army recruitment.',
      'Removed Action countering system.',
      'Removed Water.',
      'Gold system is replaced with Wood system, with 1 Wood for cutting each Forest tile. Wood is used for building Castles and recruiting armies.',
      'Armies can be used to destroy Castles.',
      'Added Camps with Armies. Randomly spawned by Villages.',
      'Added Villages. Villages spawn on your territory as it grows. Capturing a Village also captures neighboring tiles. Villages randomly spawn Forests and Camps.',
      'Capturing a Mountain also captures neighboring tiles.',
      'Non-neutral Mountains cannot be captured.',
      'Disabled manual attacks on non-neutral tiles.',
      'Disabled manual attacks on neutral tiles with 2 or more neighboring players.',
      'Improved graphics & animations.',
      'Lots of other various changes.',
    ],
    day: 22,
    month: 2,
    editedBy: 'Joeyjojo',
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
        {update.editedBy && (
          <EditorCredits>
            Edited by <span>{update.editedBy}</span>
          </EditorCredits>
        )}
      </UpdateContainer>
    ))}
  </Container>
)

export default ReleaseNotes
