import styled, { css } from 'styled-components'
import React, { useState } from 'react'
import { BREAKPOINT } from '../../constants/react'
import HowToPlay from '../../components/HowToPlay'
import Socket from '../../websockets/Socket'
import getBrowserId from '../../utils/getBrowserId'
import store from '../../store'
import { version } from '../../../package.json'
import { observer } from 'mobx-react-lite'
import LocalStorageManager from '../../LocalStorageManager'
import { Link } from 'react-router-dom'

const Container = styled.div`
  margin-top: 96px;
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
    text-align: center;
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
  color: #fff;
  font-weight: 500;
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 40px;
  background: #222;
  margin-left: 40px;
  width: 240px;
  border: 1px solid #111;
  padding-left: 16px;

  > img {
    height: 22px;
    margin-right: 12px;
    filter: invert(1);
  }

  :hover {
    background: #282828;
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
  margin-top: 16px !important;
  cursor: default;
`

const RedditButton = styled.a`
  ${buttonCSS};
  margin-top: 16px !important;
  margin-left: 0 !important;
  cursor: default;
`

const IoGamesButton = styled.a`
  display: block;
  color: #fff;
  margin-top: 24px;
  font-weight: 500;
  width: 140px;

  :hover {
    color: #aaa;
  }
`

const GuideButton = styled.a`
  ${buttonCSS};
`

const SandboxButton = styled.a`
  ${buttonCSS};
  padding-left: 16px;
  margin-top: 16px !important;
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
`

const Community: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false)

  const playTutorial = () => {
    let guestName = LocalStorageManager.get('guestName')
    if (!guestName) {
      guestName = `Guest ${Math.floor(Math.random() * 10)}`
    }

    Socket.send(
      'playTutorial',
      `${getBrowserId()}|${store.user ? store.user.name : guestName}`
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
            {store.user && (
              <Link to="/match-history">
                <MatchHistoryButton>
                  <img src={`/static/icons/history.svg?${version}`} />
                  Match history
                </MatchHistoryButton>
              </Link>
            )}
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

export default observer(Community)
