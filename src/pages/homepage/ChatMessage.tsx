import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import store from '../../store'
import Tooltip from '../../components/Tooltip'
import Api from '../../Api'
import authHeader from '../../utils/authHeader'
import { useAuth } from '../../auth'

const Container = styled.div`
  display: flex;
`

const Time = styled.p<{ grey: boolean }>`
  color: ${prop => (prop.grey ? '#bbb' : '#eee')};
  user-select: text;
  font-weight: 300;
`

const Author = styled.div<{ grey: boolean; moderator: boolean }>`
  font-weight: 600;
  user-select: text;
  white-space: nowrap;
  position: relative;
  color: ${prop => (prop.grey ? '#bbb' : '#eee')};

  > div {
    display: none;
  }

  ${props =>
    props.moderator &&
    css`
      :hover {
        background: #fff;
        color: #222;
        cursor: default;

        > div {
          display: block;
        }
      }
    `}
`

const Content = styled.p<{ grey: boolean }>`
  margin-left: 10px;
  color: ${prop => (prop.grey ? '#bbb' : '#eee')};
  user-select: text;
`

const MuteBox = styled.div`
  position: fixed;
  background: #111;
  color: #fff;
  width: 400px;
  top: 300px;
  right: 50px;
  padding: 32px;
  border: 1px solid #000;
  border-radius: 8px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }

  button {
    background: #fff;
    color: #111;
    font-weight: 600;
    font-size: 24px;
    padding: 8px 16px;
    margin: 0 8px;
    border-radius: 4px;

    :hover {
      background: #ccc;
    }
  }
`

const ButtonsRow = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
`

interface Props {
  time: number
  playerName: string
  content: string
}
const ChatMessage: React.FC<Props> = ({ time, playerName, content }) => {
  const [muteBox, setMuteBox] = useState<string | null>(null)
  const { accessToken } = useAuth()
  const { user } = store
  const moderator = !!user && user.moderator && playerName !== '[info]'

  const handleMute = () => {
    setMuteBox(null)

    if (!user || !user.moderator || !accessToken) return

    Api.ws.post(
      '/users/mute',
      {
        moderatorId: user._id,
        name: playerName,
      },
      authHeader(accessToken)
    )
  }

  return (
    <Container>
      <Time grey={playerName === '[info]'}>
        [
        {new Date(time).getHours() < 10
          ? String(new Date(time).getHours()).padStart(2, '0')
          : new Date(time).getHours()}
        :
        {new Date(time).getMinutes() < 10
          ? String(new Date(time).getMinutes()).padStart(2, '0')
          : new Date(time).getMinutes()}
        ]&nbsp;
      </Time>
      <Author
        grey={playerName === '[info]'}
        moderator={moderator}
        onClick={moderator ? () => setMuteBox(playerName) : () => {}}
      >
        {playerName}:
        <div>
          <Tooltip>MUTE THIS PLAYER</Tooltip>
        </div>
      </Author>
      <Content grey={playerName === '[info]'}>{content}</Content>

      {muteBox && (
        <MuteBox>
          <h2>Mute {muteBox} ?</h2>
          <ButtonsRow>
            <button onClick={handleMute}>YES</button>
            <button onClick={() => setMuteBox(null)}>NO</button>
          </ButtonsRow>
        </MuteBox>
      )}
    </Container>
  )
}

export default ChatMessage
