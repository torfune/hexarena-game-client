import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { BOX_SHADOW } from 'constants/react'
import game from 'game'
import store from 'store'
import { observer } from 'mobx-react-lite'

const Container = styled.div``

const MessagesContainer = styled.div`
  height: 480px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-top: 32px;
`

const Message = styled.div`
  display: flex;
`

const MessageAuthor = styled.p`
  font-weight: 600;
  color: #fff;
`

const MessageContent = styled.p`
  margin-left: 10px;
  color: #eee;
`

const Input = styled.input`
  display: block;
  background: #666;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  padding-left: 12px;
  height: 40px;
  width: 100%;
  margin-top: 32px;
  box-shadow: ${BOX_SHADOW};
  color: #fff;

  :hover,
  :focus {
    background: #777;
  }
`

const Chat = () => {
  const [message, setMessage] = useState('')
  const elementRef = useRef()

  const handleKeyDown = ({ key }) => {
    if (key === 'Enter' && message !== '') {
      setMessage('')
      game.sendMessage(message)
    }
  }

  const handleMessageChange = event => {
    setMessage(event.target.value)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  useEffect(() => {
    elementRef.current.scrollTop = elementRef.current.scrollHeight
  })

  return (
    <Container>
      <MessagesContainer ref={elementRef}>
        {store.messages.map(({ name, message }, index) => (
          <Message key={index}>
            <MessageAuthor>{name}:</MessageAuthor>
            <MessageContent>{message}</MessageContent>
          </Message>
        ))}
      </MessagesContainer>

      <Input
        autoFocus
        maxLength="64"
        value={message}
        onChange={handleMessageChange}
      />
    </Container>
  )
}

export default observer(Chat)
