import { useEffect, useState, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import game from '../../../../game'
import store from '../../../../store'
import React from 'react'

const Container = styled.div`
  height: calc(100% - 58px);
  position: relative;
`

const MessagesContainer = styled.div`
  height: calc(100% - 39px - 16px);
  overflow-y: auto;
  overflow-x: hidden;
`

const Message = styled.div`
  display: flex;
`

const MessageAuthor = styled.p`
  font-weight: 600;
  color: #fff;
  user-select: text;
  white-space: nowrap;
`

const MessageContent = styled.p`
  margin-left: 10px;
  color: #eee;
  user-select: text;
`

const Input = styled.input`
  display: block;
  width: 100%;
  background: transparent;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  height: 40px;
  border: 1px solid #555;
  color: #fff;
  position: relative;
  padding: 0 8px;
  margin-top: 16px;

  :hover,
  :focus {
    background: #383838;
    border-color: #888;
  }
`

const Chat = () => {
  const [message, setMessage] = useState('')
  const elementRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (key === 'Enter' && message !== '') {
      game.sendChatMessage(message)
      setMessage('')
    }
  }

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollTop = elementRef.current.scrollHeight
    }
  })

  if (!store.gsConfig) return null

  return (
    <Container>
      <MessagesContainer ref={elementRef}>
        {store.chatMessages.map(({ playerName, content }, index) => (
          <Message key={index}>
            <MessageAuthor>{playerName}:</MessageAuthor>
            <MessageContent>{content}</MessageContent>
          </Message>
        ))}
      </MessagesContainer>

      <Input
        autoFocus
        placeholder="Type your message ..."
        maxLength={store.gsConfig.CHAT_MESSAGE_MAX_LENGTH}
        value={message}
        onChange={handleMessageChange}
      />
    </Container>
  )
}

export default observer(Chat)
