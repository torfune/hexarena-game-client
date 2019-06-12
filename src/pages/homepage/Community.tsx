import styled, { css } from 'styled-components'
import React from 'react'

const Container = styled.div`
  margin-top: 96px;
  color: #fff;
`

const ButtonsContainer = styled.div`
  margin-top: 32px;
  display: flex;
`

const buttonCSS = css`
  width: 200px;
  border: 2px solid #bbb;
  color: #111;
  font-weight: 500;
  border-radius: 4px;
  font-size: 18px;
  display: flex;
  align-items: center;
  height: 45px;
  background: #fff;
  transition: 400ms;

  :hover {
    background: #ddd;
  }
`

const DiscordButton = styled.a`
  ${buttonCSS};
`

const RedditButton = styled.a`
  ${buttonCSS};
  margin-left: 16px;
`

const DiscordIcon = styled.img`
  height: 38px;
  margin-right: 4px;
  margin-left: 6px;
  margin-top: 4px;
`

const RedditIcon = styled.img`
  height: 26px;
  margin-left: 12px;
  margin-right: 12px;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const Community: React.FC = () => (
  <Container>
    <Heading>Community</Heading>

    <ButtonsContainer>
      <DiscordButton target="_blank" href="https://discord.gg/vwXKyRX">
        <DiscordIcon src="/static/icons/discord.svg" />
        Discord
      </DiscordButton>
      <RedditButton target="_blank" href="https://www.reddit.com/r/hexarena">
        <RedditIcon src="/static/icons/reddit.svg" />
        Reddit
      </RedditButton>
    </ButtonsContainer>
  </Container>
)

export default Community
