import styled, { css } from 'styled-components'
import React from 'react'
import { PRIMARY } from '../../constants/react'

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
  margin-bottom: 16px;

  h2 {
    font-weight: 600;
    margin-bottom: 12px;
    color: ${PRIMARY};
  }
  p,
  li {
    /* margin-top: 6px; */
    font-size: 18px;
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

const HowToPlay: React.FC = () => (
  <Container>
    <Heading>How to play</Heading>

    <Section>
      <h2>Overview</h2>
      <p>
        The goal is to capture the Opponent’s Capital or have the most tiles by
        the end of the timer. You must Claim tiles by buying them or Capture
        tiles with the Armies you send from your structures. By spreading out on
        the map and claiming Villages, you will receive a timed income. With
        that income you can train Armies, build structures, build Houses, or
        upgrade structures.
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
          destroying them with Armies secures instant income.{' '}
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

    {/* <Section>
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
    </Section> */}
  </Container>
)

export default HowToPlay
