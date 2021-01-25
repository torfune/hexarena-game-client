import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import Video from '../Video'
import hexagonIcon from '../../icons/hexagon.svg'

const Mechanics = () => (
  <div>
    <TabHeading>
      <img src={hexagonIcon} />
      Hex Mechanics
    </TabHeading>

    <Row>
      <Column>
        <h2>Surround to capture</h2>
        <Video width="280px" height="220px">
          <video width="280" autoPlay muted loop>
            <source src="/static/videos/surround.mp4" type="video/mp4" />
          </video>
        </Video>
      </Column>
      <Column>
        <h2>Cut off enemy tiles</h2>
        <Video width="250px" height="220px">
          <video width="250" autoPlay muted loop>
            <source src="/static/videos/cut-off.mp4" type="video/mp4" />
          </video>
        </Video>
      </Column>
    </Row>
  </div>
)

const Row = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: space-between;
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

export default Mechanics
