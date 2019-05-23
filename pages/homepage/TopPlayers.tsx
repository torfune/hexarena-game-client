import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import getServerHost from '../../utils/getServerHost'
import { useEffect } from 'react'
import Axios from 'axios'
import TopPlayer from '../../types/TopPlayer'
import { FadeUp } from '../../components/Animations'

const Container = styled.div`
  margin-top: 32px;
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding-bottom: 4px;
  min-height: 500px;
`

const Heading = styled.div`
  display: grid;
  grid-template-columns: 32px 1fr auto;
  padding: 12px 24px;
  font-weight: 500;
  background: #444;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin-bottom: 4px;
`

const HeadingValue = styled.p`
  color: #fff;
`

const PlayerRow = styled.div`
  padding: 10px 24px;
  display: grid;
  grid-template-columns: 32px 1fr auto;
`

const Value = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
`

const TopPlayers = () => {
  useEffect(() => {
    const { WS_HOST } = getServerHost(window.location.hostname)
    Axios.get(`http://${WS_HOST}/users/top-players`).then(response => {
      store.topPlayers = response.data as TopPlayer[]
    })
  }, [])

  return (
    <FadeUp>
      <Container>
        <Heading>
          <HeadingValue>#</HeadingValue>
          <HeadingValue>Name</HeadingValue>
          <HeadingValue>ELO</HeadingValue>
        </Heading>

        {store.topPlayers.map((player, index) => (
          <PlayerRow key={player.id}>
            <Value>{index + 1}.</Value>
            <Value>{player.name}</Value>
            <Value>{player.elo.toLocaleString()}</Value>
          </PlayerRow>
        ))}
      </Container>
    </FadeUp>
  )
}

export default observer(TopPlayers)
