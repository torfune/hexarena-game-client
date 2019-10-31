import styled, { css } from 'styled-components'
import React, { useState } from 'react'
import { BREAKPOINT } from '../../constants/react'
import HowToPlay from '../../components/HowToPlay'
import Socket from '../../websockets/Socket'
import getGuestId from '../../utils/getGuestId'
import store from '../../store'
import { version } from '../../../package.json'
import { observer } from 'mobx-react-lite'
import LocalStorageManager from '../../LocalStorageManager'
import { Link } from 'react-router-dom'

const Container = styled.div`
  margin-top: 64px;
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
    margin-bottom: 0;
    text-align: center;
  }
`

const ButtonsContainer = styled.div`
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
  color: #fff;
  font-weight: 500;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 34px;
  background: #282828;
  margin-left: 40px;
  width: 240px;
  border: 1px solid #111;
  padding-left: 16px;
  transition: 100ms background-color;

  > img {
    height: 18px;
    margin-right: 12px;
    filter: invert(1);
  }

  :hover {
    background: #242424;
  }

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    margin-left: 0;
    margin-bottom: 16px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    margin-left: 40px;
    margin-bottom: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    margin-left: 0;
    margin-bottom: 16px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    margin-left: 40px;
    margin-bottom: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    margin-left: 0;
    margin-bottom: 16px;
  }
`

const DiscordButton = styled.a`
  ${buttonCSS};
  margin-left: 0 !important;
  margin-bottom: 16px !important;
  cursor: default;
`

const RedditButton = styled.a`
  ${buttonCSS};
  margin-bottom: 16px !important;
  margin-left: 0 !important;
  cursor: default;
`

const IoGamesButton = styled.a`
  color: #ccc;
  margin-top: 24px;
  font-weight: 500;
  font-size: 14px;

  :hover {
    color: #fff;
    text-decoration: underline;
  }
`

const GuideButton = styled.a`
  ${buttonCSS};
`

const SandboxButton = styled.a`
  ${buttonCSS};
  padding-left: 16px;
  margin-bottom: 16px !important;
`

const SoundButton = styled.div`
  ${buttonCSS};
  margin-left: 0 !important;
`

const SoundCheckbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  background: #282828;
  margin-left: auto;
  margin-right: 16px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  > img {
    filter: invert(1);
    height: 12px;
  }

  ${props =>
    props.checked
      ? css`
          border: 2px solid #fff;
          > img {
            opacity: 1;
          }
        `
      : css`
          border: 2px solid #111;
          > img {
            opacity: 0;
          }
        `}
`

const MatchHistoryButton = styled.div`
  ${buttonCSS};
  margin-bottom: 16px !important;
`

const Buttons: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false)

  const playTutorial = () => {
    let guestName = LocalStorageManager.get('guestName')
    if (!guestName) {
      guestName = `Guest ${Math.floor(Math.random() * 10)}`
    }

    Socket.send(
      'playTutorial',
      `${getGuestId()}|${store.user ? store.user.name : guestName}`
    )
  }

  const toggleSoundSettings = () => {
    store.settings.sound = !store.settings.sound
    LocalStorageManager.set('soundEnabled', String(store.settings.sound))
  }

  return (
    <>
      <Container>
        {/* <SoundButton onClick={toggleSoundSettings}>
          <img src="/static/icons/sound.svg" /> Sounds
          <SoundCheckbox checked={store.settings.sound}>
            <img src="/static/icons/check.svg" />
          </SoundCheckbox>
        </SoundButton> */}

        <ButtonsContainer>
          <div>
            <DiscordButton target="_blank" href="https://discord.gg/vwXKyRX">
              <img src={`/static/icons/discord.svg?${version}`} />
              Discord
            </DiscordButton>
            <RedditButton
              target="_blank"
              href="https://www.reddit.com/r/hexarena"
            >
              <img src={`/static/icons/reddit.svg?${version}`} />
              Reddit
            </RedditButton>
          </div>

          <div>
            {/* <GuideButton onClick={() => setShowGuide(true)}>
              <img src="/static/icons/book.svg" />
              How to play
            </GuideButton> */}
            <SandboxButton onClick={playTutorial}>
              <img src="/static/icons/sandbox.svg" />
              Sandbox mode
            </SandboxButton>
            {store.user && (
              <Link to="/match-history">
                <MatchHistoryButton>
                  <img src={`/static/icons/history.svg?${version}`} />
                  Match history
                </MatchHistoryButton>
              </Link>
            )}
          </div>
        </ButtonsContainer>
        <IoGamesButton target="_blank" href="https://iogames.space">
          More io games
        </IoGamesButton>
      </Container>
      <HowToPlay show={showGuide} close={() => setShowGuide(false)} />
    </>
  )
}

export default observer(Buttons)
