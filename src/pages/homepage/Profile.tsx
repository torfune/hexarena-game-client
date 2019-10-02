import styled from 'styled-components'
import { PRIMARY, BREAKPOINT } from '../../constants/react'
import React from 'react'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import shadeColor from '../../utils/shade'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #282828;
  border: 1px solid #111;
  border-radius: 4px;
  padding: 12px 16px;
  width: 240px;
  margin-top: 38px;
`

const Stats = styled.div`
  margin-bottom: 6px;
  font-size: 14px;

  > p {
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    margin-bottom: 14px;
  }

  > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
`

const StatLabel = styled.p`
  font-weight: 400;
  color: #ddd;
`

const StatValue = styled.p`
  margin-left: auto;
  font-weight: 600;
  color: ${shadeColor(PRIMARY, 40)};
`

const LogoutButton = styled.div`
  font-size: 12px;
  text-align: right;
  color: #aaa;

  :hover {
    text-decoration: underline;
    color: #fff;
  }
`

const Moderator = styled.div``

const Profile = () => {
  const { logout } = useAuth()

  if (!store.user) return null

  return (
    <Container>
      {!!store.user.elo && (
        <>
          <Stats>
            <p>Your stats</p>

            <div>
              <StatLabel>Elo:</StatLabel>
              <StatValue>{store.user.elo}</StatValue>
            </div>
            <div>
              <StatLabel>Winrate:</StatLabel>
              <StatValue>-</StatValue>
            </div>
            <div>
              <StatLabel>Games played:</StatLabel>
              <StatValue>-</StatValue>
            </div>
          </Stats>

          {!!store.user.moderator && <Moderator>CHAT MODERATOR</Moderator>}
        </>
      )}
      {!store.queue && <LogoutButton onClick={logout}>Sign out</LogoutButton>}
    </Container>
  )
}

export default observer(Profile)
