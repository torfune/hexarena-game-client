import React from 'react'
import styled from 'styled-components'

import Heading from './Heading'
import { PRIMARY } from '../../constants'

const Container = styled.div``

const UpdateContainer = styled.div`
  color: #fff;
  margin-top: 32px;
  margin-bottom: 32px;
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
    version: 'Alpha 1.4.1',
    points: [
      'Camps are spawning less frequently.',
      'Game automatically finishes after 15 minutes. Player with most tiles wins.',
    ],
    day: 17,
    month: 3,
  },
  {
    version: 'Alpha 1.4.0',
    points: [
      'Armies are more responsive.',
      'Color selector is now in Waiting screen in order to prevent same color players.',
      'Village can spawn 2 forests and 2 camps.',
      'Added WASD camera movement.',
      'Improved hover descriptions, it now shows wood costs.',
      'Small graphics improvements & bug fixes.',
    ],
    day: 15,
    month: 3,
  },
  {
    version: 'Alpha 1.3.2',
    points: [
      'Leaderboard is now sorted correctly.',
      'Fixed some small bugs and glitches.',
    ],
    day: 10,
    month: 3,
  },
  {
    version: 'Alpha 1.3.1',
    points: [
      'Faster manual attacks.',
      'Added capture previews.',
      'Fixed many small bugs and glitches.',
    ],
    day: 9,
    month: 3,
  },
  {
    version: 'Alpha 1.3.0',
    points: [
      'Added Action queue.',
      'Slower game tempo.',
      'Auto-capture of neutral tiles with >= 5 neighbors.',
      'Smaller world size.',
      'In-game Action icons.',
      "Window resize doesn't break the game.",
    ],
    day: 7,
    month: 3,
  },
  {
    version: 'Alpha 1.2.1',
    points: ['Added waiting screen chat.', 'Game is more stable.'],
    day: 3,
    month: 3,
  },
  {
    version: 'Alpha 1.2.0',
    points: [
      'Wood capacity is now 6 instead of 4.',
      'Castle costs 2 wood instead of 1.',
      'Castle starts with free Army.',
      'Game is split into multiple arena instances with 3 - 6 players. Last alive wins.',
      'Capturing a mountain is as fast as any other tile.',
      'Selectable pattern colors.',
      'Manual attacks are little bit slower.',
      'Several army bugs are fixed.',
    ],
    day: 2,
    month: 3,
  },
  {
    version: 'Alpha 1.1.0',
    points: [
      'Improved Mountain generator.',
      'Escape now cancels Action instead of quitting game.',
      'Player names are visible on hover.',
      'Contested tiles are marked with icon.',
      'Improved Village spawn algorithm, they never spawn on empire border.',
    ],
    day: 24,
    month: 2,
  },
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
