import { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import axios from 'axios'
import store from '../../store'
import { WS_URL } from '../../constants/shared'

const Container = styled.div`
  margin-top: 32px;
`

const Winner = styled.div`
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  padding: 8px 32px;
  border-radius: 8px;
  margin-bottom: 8px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
`

const Name = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  margin-left: 10px;
`

const Pattern = styled.div`
  border-radius: 100%;
  width: 16px;
  height: 16px;
  background: ${props => props.color};
`

const Winners = () => {
  useEffect(() => {
    axios.get(`${WS_URL}/winners`).then(response => {
      store.winners = response.data
    })
  }, [])

  return (
    <Container>
      {store.winners.map((winner, index) => (
        <Winner key={index}>
          <Row key={index}>
            <Pattern color={winner.pattern} />
            <Name>{winner.name}</Name>
          </Row>
        </Winner>
      ))}
    </Container>
  )
}

export default observer(Winners)
