import React from 'react'
import Heading from '../Heading'
import styled from 'styled-components'
import { PRIMARY, TEXT_SHADOW } from '../../../constants/react'

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Column = styled.div`
  text-align: center;
  color: #fff;
  padding-right: 24px;
  padding-left: 24px;
  border-left: 2px solid #333;

  :first-child {
    padding-left: 0;
    border-left: 0;
  }
  :last-child {
    padding-right: 0;
  }
`

const Label = styled.p``

const Number = styled.p`
  margin-top: 8px;
  font-size: 56px;
  color: ${PRIMARY};
  font-weight: 600;
  text-shadow: ${TEXT_SHADOW};
`

const Stats = () => (
  <Container>
    <Column>
      <Label>
        In-game
        <br />
        players
      </Label>
      <Number>14</Number>
    </Column>

    <Column>
      <Label>
        Running
        <br />
        games
      </Label>
      <Number>2</Number>
    </Column>

    <Column>
      <Label>
        Finished
        <br />
        games
      </Label>
      <Number>12</Number>
    </Column>

    <Column>
      <Label>
        Waiting
        <br />
        players
      </Label>
      <Number>4</Number>
    </Column>
  </Container>
)

export default Stats
