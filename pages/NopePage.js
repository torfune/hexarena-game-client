import React from 'react'
import styled from 'styled-components'
import store from 'store'
import { PRIMARY, BOX_SHADOW } from 'constants/react'

const Container = styled.div`
  background: #ddd;
  max-width: 50vw;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  padding: 36px;
  margin-top: 256px;
  font-weight: 600;
  box-shadow: ${BOX_SHADOW};
`

const Text = styled.p`
  text-align: center;
  font-size: 24px;
  color: #333;
`

const AlreadyPlaying = () => (
  <Container>
    <Text>
      Nope, <span style={{ color: PRIMARY }}>{store.alreadyPlaying}</span>,
      that's not how it works... :)
    </Text>
  </Container>
)

export default AlreadyPlaying
