import { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import getCookie from '../utils/getCookie'

const Container = styled.div`
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 128px;
  align-items: center;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 32px;
`

const Button = styled.a`
  background: ${props => props.background};
  color: ${props => props.color};
  width: 256px;
  padding: 16px;
  border-radius: 2px;
  margin-top: 16px;
  box-shadow: 0 4px 16px #00000022;
  text-align: center;
  font-weight: 600;
  transition: 100ms;

  :hover {
    transform: scale(1.05);
  }
`

const Username = styled.p`
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 32px;
`

const Profile = () => {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const param = window.location.href.split('?')[1]
    const token = param ? param.replace('token=', '').replace('#', '') : ''

    console.log(`Token: ${token}`)

    axios
      .get('http://localhost:5000/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        setProfile(res.data)
      })
  }, [])

  if (!profile) return null

  return (
    <Container>
      <Heading>Logged in as</Heading>

      <Username>{profile.username}</Username>

      <Button
        href="http://localhost:5000/auth/logout"
        background="#fff"
        color="#222"
      >
        Logout
      </Button>
    </Container>
  )
}

export default Profile
