import styled, { css } from 'styled-components'
import React from 'react'
import { PRIMARY, BREAKPOINT } from '../../constants/react'

const Container = styled.div`
  margin-top: 96px;
  color: #fff;
  grid-column: 2;
  grid-row: 3;

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    grid-column: 1 / span 2;
    grid-row: 4;
    margin-top: 64px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    grid-column: 1;
    grid-row: 5;
  }

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    grid-column: 1 / span 2;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    grid-column: 1;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    display: none;
  }
`

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 500;
`

const Section = styled.div`
  margin-top: 32px;
  margin-bottom: 16px;

  h2 {
    font-weight: 700;
    margin-bottom: 12px;
    color: ${PRIMARY};
    font-size: 18px;
    text-transform: uppercase;
  }
  p {
    text-align: justify;
  }
  p,
  li {
    font-size: 16px;
    color: #eee;
    line-height: 32px;
  }
`

const Author = styled.p`
  margin-top: 16px;
  text-align: right;

  span {
    color: ${PRIMARY};
    font-weight: 600;
  }
`

const _HowToPlay: React.FC = () => (
  <Container>
    <Heading>How to play</Heading>

    <Section>
      <h2>Overview</h2>
      <p>
        The goal is to capture the Opponent’s Capital or have the most tiles by
        the end of the timer. You must Claim tiles by buying them or Capture
        tiles with the Armies you send from your structures. By spreading out on
        the map and claiming Villages, you will receive a timed income. With
        that income you can train Armies in Castles, build structures, build
        Houses, or upgrade structures.
      </p>
    </Section>

    <Section>
      <h2>Controls</h2>
      <p>
        <b>Move Camera:</b> WASD or Mouse
      </p>
      <p>
        <b>Zoom:</b> Q E or Mouse Wheel
      </p>
      <p>
        <b>Interaction:</b> Left Mouse Click
      </p>
    </Section>

    <Section>
      <h2>Game Mechanics</h2>
      <ul>
        <li>Actions are done by spending Gold.</li>
        <li>
          Gold is collected through Villages over time, shown in the bottom
          left.
        </li>
        <li>
          Claim neutral tiles by paying 1 Gold, or send Armies to capture them.
        </li>
        <li>You can only capture Opponents tiles using Armies. </li>
        <li>Any disconnected tiles from your Capital are lost.</li>
        <li>
          Surrounding Opponent’s or neutral tiles captures all inner tiles.
        </li>
        <li>
          Work your way to the Opponent’s Capital to win or defend the most
          tiles until the timer runs out.
        </li>
      </ul>
    </Section>

    <Section>
      <h2>Strategy</h2>

      <ol>
        <li>
          Capturing and Claiming tiles is essential. Spread out to capture
          Villages and gain positioning to defend and attack.
        </li>

        <li>
          Secure Opponent’s or neutral Villages to gain money over time -
          destroying them with Armies secures instant income.
        </li>

        <li>
          Conquer the map! Villages and chances to flank your opponent are
          hidden in the fog.
        </li>

        <li>
          Be careful how much money you spend! A higher income does not
          guarantee a win if the money is wasted.
        </li>

        <li>
          Send your Armies with purpose. A well-timed deployment can be a huge
          advantage
        </li>

        <li>
          Capturing the Capital is one way to win - but defending the most tiles
          until the timer runs out secures a win.
        </li>
      </ol>
    </Section>

    <Author>
      Written by <span>Slamm</span>
    </Author>
  </Container>
)

export default _HowToPlay
