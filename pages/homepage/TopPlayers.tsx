import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import getServerHost from '../../utils/getServerHost'
import { useEffect } from 'react'
import Axios from 'axios'
import TopPlayer from '../../types/TopPlayer'

const Container = styled.div`
  height: 100%;
`

const List = styled.div`
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  min-height: 500px;
  padding-top: 4px;
  padding-bottom: 16px;
`

const Heading = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr auto;
  padding: 12px 24px;
  font-weight: 500;
  background: #444;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

const HeadingValue = styled.p`
  color: #fff;
`

const PlayerRow = styled.div`
  padding: 8px 24px;
  display: grid;
  grid-template-columns: 32px 1fr auto;
`

const Value = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
`

const TopPlayers: React.FC = () => {
  useEffect(() => {
    const { WS_HOST } = getServerHost(window.location.hostname)
    Axios.get(`http://${WS_HOST}/users/top-players`).then(response => {
      store.topPlayers = response.data as TopPlayer[]
    })
  }, [])

  return (
    <Container>
      <Heading>
        <HeadingValue>#</HeadingValue>
        <HeadingValue>Name</HeadingValue>
        <HeadingValue>ELO</HeadingValue>
      </Heading>

      <List>
        {store.topPlayers.map((player, index) => (
          <PlayerRow key={player.id}>
            <Value>{index + 1}.</Value>
            <Value>{player.name}</Value>
            <Value>{player.elo.toLocaleString()}</Value>
          </PlayerRow>
        ))}
      </List>
    </Container>
  )
}

export default observer(TopPlayers)
