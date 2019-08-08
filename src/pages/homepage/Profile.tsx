import styled from 'styled-components'
import { PRIMARY, BREAKPOINT } from '../../constants/react'
import React from 'react'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    margin-top: 48px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    margin-top: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    margin-top: 48px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    margin-top: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    margin-top: 48px;
  }
`

const EloSection = styled.div`
  text-align: right;
  margin-bottom: 16px;

  p {
    text-transform: uppercase;
    font-weight: 600;
    color: ${PRIMARY};
    font-size: 20px;
  }

  span {
    font-weight: 600;
    font-size: 20px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    text-align: left;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    text-align: right;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    text-align: left;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    text-align: right;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    text-align: left;
  }
`

const LogoutButton = styled.div`
  width: 74px;
  text-align: right;
  margin-left: auto;

  :hover {
    text-decoration: underline;
  }

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    margin-top: 16px;
    text-align: left;
    margin-left: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    margin-top: 0;
    text-align: right;
    margin-left: auto;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    margin-top: 16px;
    text-align: left;
    margin-left: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    margin-top: 0;
    text-align: right;
    margin-left: auto;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    margin-top: 16px;
    text-align: left;
    margin-left: 0;
  }
`

const Profile = () => {
  const { logout } = useAuth()

  if (!store.user) return null

  return (
    <Container>
      {!!store.user.elo && (
        <>
          <EloSection>
            <p>Elo</p>
            <span>{store.user.elo}</span>
          </EloSection>

          {!!store.user.diamonds && (
            <EloSection>
              <p>Diamonds</p>
              <span>{store.user.diamonds}</span>
            </EloSection>
          )}
        </>
      )}
      {!store.queue && <LogoutButton onClick={logout}>Logout</LogoutButton>}
    </Container>
  )
}

export default observer(Profile)
