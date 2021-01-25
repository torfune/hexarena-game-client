import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import Video from '../Video'
import controlsIcon from '../../icons/controls.svg'

const Controls = () => {
  return (
    <Container>
      <TabHeading>
        <img src={controlsIcon} />
        Controls
      </TabHeading>

      <Row>
        <Text>
          <h2>Interaction</h2>
          <p>click on a tile</p>

          <h2>Move camera</h2>
          <p>mouse drag &amp; drop or W/A/S/D keys</p>

          <h2>Zoom</h2>
          <p>mousewheel or E/Q keys</p>
        </Text>
        <Video width="220px" height="220px">
          <video width="220" autoPlay muted loop>
            <source src="/static/videos/controls.mp4" type="video/mp4" />
          </video>
        </Video>
      </Row>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`

const Text = styled.div`
  width: 300px;

  h2 {
    font-size: 16px;
    font-weight: 700;
  }

  p {
    margin-bottom: 16px;
  }
`

export default Controls
