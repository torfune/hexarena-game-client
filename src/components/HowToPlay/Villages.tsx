import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import TabDescription from './TabDescription'
import Video from '../Video';

const Container = styled.div``

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -2px;
`

const Column = styled.div`
  h2 {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 8px;
    color: #fff;
  }
`

const Villages = () => {
  return (
    <Container>
      <TabHeading>
        <img src="/game/static/icons/village.svg" />
        Villages
      </TabHeading>
      <TabDescription>
        <li>
          Capturing neutral Villages increases your Gold income speed.
        </li>
        <li>Raiding Village with an Army gives instant Gold.</li>
        <li>Village is bound to adjacent tiles of the same color.</li>
      </TabDescription>

      <Row>
        <Column>
          <h2>Capture neutral Village</h2>
          <Video width="264px" height="120px" >
            <video width="264" autoPlay muted loop>
              <source src="/game/static/videos/village-capture.mp4" type="video/mp4" />
            </video>
          </Video>
        </Column>
        <Column>
          <h2>Raid enemy Village</h2>
          <Video width="264px" height="120px">
            <video width="264" autoPlay muted loop>
              <source src="/game/static/videos/village-raid.mp4" type="video/mp4" />
            </video>
          </Video>
        </Column>
      </Row>
    </Container>
  )
}

export default Villages
