import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { observer } from 'mobx-react-lite'
import { BOX_SHADOW, PRIMARY, BLUE } from '../../../constants'
import store from '../../../../store'

const WIDTH = 700

const Container = styled.div`
  position: absolute;
  top: 200px;
  width: ${WIDTH}px;
  background: #fff;
  text-align: center;
  padding-top: 96px;
  padding-bottom: 64px;
  left: 50vw;
  transform: translateX(-${WIDTH / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;

  h2 {
    font-size: 32px;
    color: #222;
  }
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`

const Button = styled.div`
  background: ${props => props.color};
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 64px;
  border-radius: 4px;
  width: 260px;
  margin: 0 16px;
  transition: 100ms;
  text-align: center;
  box-shadow: ${BOX_SHADOW};
  cursor: pointer;

  :hover {
    transform: scale(1.05);
  }
`

const DefeatModal = () => {
  const handleSpectateClick = () => {
    store.spectating = true
  }

  return (
    <Container>
      <h2>You have lost your Capital!</h2>

      <ButtonRow>
        <Link to="/">
          <Button color={PRIMARY}>Play again</Button>
        </Link>

        <Button color={BLUE} onClick={handleSpectateClick}>
          Spectate
        </Button>
      </ButtonRow>
    </Container>
  )
}

export default observer(DefeatModal)
