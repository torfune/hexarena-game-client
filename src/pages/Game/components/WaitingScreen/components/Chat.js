import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

import { BOX_SHADOW } from '../../../../../constants'

const Container = styled.div`
  border-left: 2px solid #333;
  padding-left: 64px;
`

const Heading = styled.h2`
  color: #fff;
  font-size: 32px;
`

const MessagesContainer = styled.div`
  height: 512px;
  overflow-y: scroll;
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
`

const Chat = ({ messages, sendMessage }) => {
  const [message, setMessage] = useState('')
  const elementRef = useRef()

  const handleKeyDown = ({ key }) => {
    if (key === 'Enter' && message !== '') {
      setMessage('')
      sendMessage(message)
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
    console.log(elementRef.current)
    elementRef.current.scrollTop = elementRef.current.scrollHeight
  })

  return (
    <Container>
      <Heading>Chat</Heading>

      <MessagesContainer ref={elementRef}>
        {messages.map(([author, content], index) => (
          <Message key={index}>
            <MessageAuthor>{author}:</MessageAuthor>
            <MessageContent>{content}</MessageContent>
          </Message>
        ))}
      </MessagesContainer>

      <Input autoFocus value={message} onChange={handleMessageChange} />
    </Container>
  )
}

export default Chat
