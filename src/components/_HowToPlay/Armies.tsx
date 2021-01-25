import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import TabDescription from './TabDescription'
import Video from '../Video'
import armyIcon from '../../icons/army.svg'

const Armies = () => {
  return (
    <div>
      <TabHeading>
        <img src={armyIcon} />
        Armies
      </TabHeading>

      <TabDescription>
        <li>Use Armies to attack your enemy.</li>
        <li>An Army captures 6 tiles in it's direction if it's not blocked.</li>
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
    </div>
  )
}

const Row = styled.div`
  margin-top: -8px;
  display: flex;
  justify-content: space-between;
`

export default Armies
