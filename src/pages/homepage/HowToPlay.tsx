import styled, { css } from 'styled-components'
import React from 'react'

const Container = styled.div`
  margin-top: 96px;
  color: #fff;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const Section = styled.div`
  margin-top: 32px;

  h2 {
    font-weight: 500;
    margin-bottom: 8px;
  }
  p {
    margin-top: 8px;
    font-size: 18px;
    color: #ccc;
  }
`

const HowToPlay: React.FC = () => (
  <Container>
    <Heading>How to play</Heading>

    <Section>
      <h2>Goal</h2>

      <p>
        Your goal is to capture your opponent's capital or force him to
        surrender.
      </p>
    </Section>

    <Section>
      <h2>Villages &amp; Economy</h2>

      <p>Villages are the engine of your economy.</p>
      <p>Bigger economy generates gold faster.</p>
      <p>It's important to protect your villages from enemy armies!</p>
    </Section>

    <Section>
      <h2>Buildings &amp; Armies</h2>

      <p>
        Base is the most important building, when you lose it, you lose the
        game. You can also recruit armies there.
      </p>
      <p>Camp and Tower can host and send armies but can't recruit them.</p>
      <p>Tower and Castle start with free army and hitpoints.</p>
      <p>Castle can recruit armies.</p>
    </Section>
  </Container>
)

export default HowToPlay
