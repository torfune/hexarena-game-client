import styled, { css } from 'styled-components'
import React from 'react'
import { BREAKPOINT } from '../../constants/react'

const Container = styled.div`
  margin-top: 128px;
  color: #fff;
  grid-column: 2;
  grid-row: 2;

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    grid-column: 1;
    margin-top: 80px;
  }

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    grid-column: 2;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    grid-column: 1;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    margin-top: 0;
  }
`

const ButtonsContainer = styled.div`
  margin-top: 32px;
  display: flex;

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    flex-direction: column;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    flex-direction: row;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    flex-direction: column;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    flex-direction: row;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    flex-direction: column;
  }
`

const buttonCSS = css`
  color: #111;
  font-weight: 500;
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 40px;
  background: #fff;
  margin-left: 40px;
  width: 240px;

  :hover {
    background: #ddd;
  }

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    margin-left: 0;
    margin-top: 16px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    margin-left: 40px;
    margin-top: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    margin-left: 0;
    margin-top: 16px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    margin-left: 40px;
    margin-top: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    margin-left: 0;
    margin-top: 16px;
  }
`

const DiscordButton = styled.a`
  ${buttonCSS};
  margin-left: 0 !important;
  margin-top: 0 !important;
`

const RedditButton = styled.a`
  ${buttonCSS};
  margin-top: 16px !important;
  margin-left: 0 !important;
`

const IoGamesButton = styled.a`
  ${buttonCSS};
  padding-left: 16px;
`

const DiscordIcon = styled.img`
  height: 28px;
  margin-right: 4px;
  margin-left: 6px;
  margin-top: 4px;
`

const RedditIcon = styled.img`
  height: 20px;
  margin-left: 10px;
  margin-right: 8px;
`

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 500;
`

const Community: React.FC = () => (
  <Container>
    <Heading>Community</Heading>

    <ButtonsContainer>
      <div>
        <DiscordButton target="_blank" href="https://discord.gg/vwXKyRX">
          <DiscordIcon src="/static/icons/discord.svg" />
          Discord
        </DiscordButton>
        <RedditButton target="_blank" href="https://www.reddit.com/r/hexarena">
          <RedditIcon src="/static/icons/reddit.svg" />
          Reddit
        </RedditButton>
      </div>
      <IoGamesButton target="_blank" href="https://iogames.space">
        More IO Games
      </IoGamesButton>
    </ButtonsContainer>
  </Container>
)

export default Community
