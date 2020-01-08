import styled from 'styled-components'
import TabHeading from './TabHeading'
import React from 'react'
import Video from '../Video'

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

  p {
    margin-bottom: 24px;
  }
`

const Goal = () => {
  return (
    <Container>
      <TabHeading>
        <img src="/game/static/icons/goal.svg" />
        Goal
      </TabHeading>

      <Row>
        <Text>
          <p>The goal is to capture enemy Capital.</p>
          <p>
            Game automatically ends after 8&nbsp;minutes. Player or Team with
            the most tiles wins.
          </p>
        </Text>
        <Video width="220px" height="260px">
          <video width="220" autoPlay muted loop>
            <source src="/game/static/videos/victory.mp4" type="video/mp4" />
          </video>
        </Video>
      </Row>
    </Container>
  )
}

export default Goal
