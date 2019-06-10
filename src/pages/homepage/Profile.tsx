import styled from 'styled-components'
import { PRIMARY } from '../../constants/react'
import React from 'react'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const EloSection = styled.div`
  /* width: 80px; */
  text-align: right;

  p {
    text-transform: uppercase;
    font-weight: 600;
    color: ${PRIMARY};
    font-size: 20px;
  }

  span {
    font-size: 24px;
  }
`

const LogoutButton = styled.div`
  :hover {
    text-decoration: underline;
  }
`

const Profile = () => {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <Container>
      {!!user.elo && (
        <EloSection>
          <p>Elo</p>
          <span>{user.elo}</span>
        </EloSection>
      )}
      {!store.waitingTime && (
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      )}
    </Container>
  )
}

export default observer(Profile)
