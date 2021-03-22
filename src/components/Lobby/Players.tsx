import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../core/store'
import { useTransition } from 'react-spring'
import React, { useState } from 'react'
import Player from '../../core/classes/Player'
import PatternSelector from './PatternSelector'
import { COLOR, SHADOW, TRANSITION } from '../../constants/constants-react'

interface Props {
  players: Player[]
  ffa?: boolean
}
const Players: React.FC<Props> = ({ players, ffa }) => {
  const [showSelector, setShowSelector] = useState(false)
  const transitions = useTransition(showSelector, null, TRANSITION.SCALE)

  if (!store.game || !store.game.player || !store.gsConfig) return null

  const { pattern, id: playerId } = store.game.player
  const { PATTERNS } = store.gsConfig
  const lockedPatterns = Array.from(store.game.players.values())
    .filter((player) => player.pattern !== pattern)
    .map(({ pattern }) => pattern)

  const handlePatternClick = () => {
    setShowSelector(true)
  }

  const handleClickOutside = () => {
    setShowSelector(false)
  }

  const handlePatternSelect = (pattern: string) => {
    if (lockedPatterns.includes(pattern) || !store.game) return

    store.game.selectPattern(pattern)
    setShowSelector(false)
  }

  return (
    <Container ffa={ffa}>
      {players.map((player) => (
        <PlayerContainer key={player.id}>
          {player.id === playerId ? (
            <>
              <Pattern
                color={player.pattern}
                onClick={handlePatternClick}
                hoverEffect
              />
              <Name>{player.name}</Name>
            </>
          ) : (
            <>
              <Pattern color={player.pattern} />
              <Name>???</Name>
            </>
          )}

          {player.id === playerId &&
            transitions.map(
              ({ item, key, props }) =>
                item && (
                  <PatternSelector
                    key={key}
                    style={props}
                    allPatterns={PATTERNS}
                    lockedPatterns={lockedPatterns}
                    onPatternSelect={handlePatternSelect}
                  />
                )
            )}
        </PlayerContainer>
      ))}

      {showSelector && <DarkOverlay onClick={handleClickOutside} />}
    </Container>
  )
}

const Container = styled.div<{ ffa?: boolean }>`
  display: flex;
  padding-top: 128px;
  align-items: center;
  flex-direction: column;

  ${(props) =>
    props.ffa &&
    css`
      max-width: 800px;
      padding-top: 0;
      flex-direction: row;
      justify-content: center;
      flex-wrap: wrap;
      margin-left: auto;
      margin-right: auto;
    `}
`
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${COLOR.GREY_600};
  box-shadow: ${SHADOW.MEDIUM};
  border-radius: 10px;
  height: 180px;
  width: 180px;
  padding-top: 8px;
  position: relative;
  margin: 16px;
`
const Pattern = styled.div<{ color: string; hoverEffect?: boolean }>`
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: ${(props) => props.color};
  transition: 200ms;
  cursor: ${(props) => (props.hoverEffect ? 'pointer' : 'null')};
  box-shadow: ${SHADOW.MEDIUM};

  :hover {
    transform: ${(props) => (props.hoverEffect ? 'scale(1.1)' : null)};
  }
`
const Name = styled.div`
  margin-top: 16px;
  color: #fff;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  overflow: hidden;
`
const DarkOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  background: #000;
  opacity: 0.5;
`

export default observer(Players)
