import { useEffect, useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import React from 'react'
import Socket from '../../websockets/Socket'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { CHAT_WIDTH, BREAKPOINT } from '../../constants/react'
import { useAuth } from '../../auth'
import ChatMessage from './ChatMessage'

const Container = styled.div`
  z-index: 2;
  background: #222;
  position: fixed;
  color: #fff;
  right: 0;
  padding-right: 32px;
  border-left: 1px solid #111;
  padding-left: 32px;
  padding-bottom: 32px;
  padding-top: 48px;
  top: 60px;
  width: ${CHAT_WIDTH};
  height: calc(100vh - 60px);

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    display: none;
  }
`

const StyledSimpleBar = styled(SimpleBar)`
  height: calc(100% - 56px);
`

const Input = styled.input`
  display: block;
  width: 100%;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  height: 40px;
  color: #fff;
  position: relative;
  padding: 0 12px;
  margin-top: 16px;
  background: #1a1a1a;
  transition: 100ms;

  ::placeholder {
    font-size: 14px;
  }

  :hover,
  :focus {
    background: #181818;
  }
`

const SignInMessage = styled.div`
  display: flex;
  margin-top: 24px;

  > img {
    height: 20px;
  }

  > p {
    margin-left: 6px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
`

const Chat = () => {
  const [scrolled, setScrolled] = useState(false)
  const { accessToken } = useAuth()

  useEffect(() => {
    addEventListener('wheel', handleWheelMove)

    return () => {
      removeEventListener('wheel', handleWheelMove)
    }
  }, [])

  let lastScrolled: number | null = null

  const handleWheelMove = (event: any) => {
    const delta = event.deltaY || event.detail
    const scrollDirection = (delta < 0 ? -1 : 1) * -1
    const chat = document.getElementById('chat')
    const ele = document.querySelector(
      '#chat-message-container .simplebar-content-wrapper'
    )

    if (scrollDirection > 0 && chat && chat.matches(':hover')) {
      setScrolled(true)
    }

    if (ele) {
      if (lastScrolled === ele.scrollTop) {
        setScrolled(false)
      } else if (
        chat &&
        chat.matches(':hover') &&
        lastScrolled !== ele.scrollTop
      ) {
        setScrolled(true)
      }
      lastScrolled = ele.scrollTop
    }
  }

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (
      key !== 'Enter' ||
      !store.chatMessage ||
      !store.gsConfig ||
      !store.user ||
      !store.user.name
    ) {
      return
    }

    Socket.send(
      'chatMessage',
      `${store.user._id}|${accessToken}|${store.chatMessage}`
    )
    store.chatMessage = ''
    setScrolled(false)
  }

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    store.chatMessage = event.target.value
  }

  const handleFocus = () => {
    store.chatFocus = true
  }

  const handleBlur = () => {
    store.chatFocus = false
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    const ele = document.querySelector(
      '#chat-message-container .simplebar-content-wrapper'
    )
    if (ele && !scrolled) {
      ele.scrollTop = ele.scrollHeight
    }
  }, [store.chatMessages, store.chatMessage])

  if (!store.gsConfig) return null

  return (
    <Container id="chat">
      <StyledSimpleBar id="chat-message-container">
        {store.chatMessages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </StyledSimpleBar>

      {(!store.user || !store.user.name) && (
        <>
          <SignInMessage>
            <img src="/static/icons/info-circle.svg" />
            <p>Sign in to use chat.</p>
          </SignInMessage>
        </>
      )}

      {store.user && store.user.name && (
        <>
          {store.user.mute ? (
            <>
              <SignInMessage>
                <img src="/static/icons/info-circle.svg" />
                <p>Chat muted for spamming or offensive language.</p>
              </SignInMessage>
            </>
          ) : (
            <Input
              autoFocus
              placeholder="Type your message ..."
              maxLength={store.gsConfig.CHAT_MESSAGE_MAX_LENGTH}
              value={store.chatMessage}
              onChange={handleMessageChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          )}
        </>
      )}
    </Container>
  )
}

export default observer(Chat)
