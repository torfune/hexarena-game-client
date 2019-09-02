import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import TabDescription from './TabDescription'
import Video from '../Video'

const Container = styled.div``

const Row = styled.div`
  margin-top: -8px;
  display: flex;
  justify-content: space-between;
`

const Column = styled.div``

const Armies = () => {
  return (
    <Container>
      <TabHeading>
        <img src="/static/icons/army.svg" />
        Armies
      </TabHeading>

      <TabDescription>
        <li>Use Armies to attack your enemy.</li>
        <li>An Army captures tiles in it's direction until it's blocked.</li>
        <li>Can be trained in Castle and Capital (50% slower).</li>
        <li>Can be blocked by Mountain, Building, Forest or enemy Army.</li>
      </TabDescription>

      <Row>
        <Video width="264px" height="120px">
          <video width="264" autoPlay muted loop>
            <source src="/static/videos/army-1.mp4" type="video/mp4" />
          </video>
        </Video>
        <Video width="264px" height="120px">
          <video width="264" autoPlay muted loop>
            <source src="/static/videos/army-2.mp4" type="video/mp4" />
          </video>
        </Video>
      </Row>
    </Container>
  )
}

export default Armies
