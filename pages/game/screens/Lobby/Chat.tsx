import { useEffect, useState, useRef, ChangeEvent } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { BOX_SHADOW } from '../../../../constants/react'
import game from '../../../../game'
import store from '../../../../store'

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
  user-select: text;
`

const MessageContent = styled.p`
  margin-left: 10px;
  color: #eee;
  user-select: text;
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
        maxLength={64}
        value={message}
        onChange={handleMessageChange}
      />
    </Container>
  )
}

export default observer(Chat)
