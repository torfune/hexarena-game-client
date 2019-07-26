import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../../../store'
import { useTransition } from 'react-spring'
import React, { useState } from 'react'
import Player from '../../../../game/classes/Player'
import PatternSelector from './PatternSelector'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 840px;
  /* flex-wrap: wrap; */
`

const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  background: #222;
  border-radius: 12px;
  height: 240px;
  width: 220px;
  padding-top: 8px;
  position: relative;
  margin: 16px 0;
`

const Pattern = styled.div<{ color: string; hoverEffect?: boolean }>`
  width: 128px;
  height: 128px;
  border-radius: 16px;
  border: 1px solid #000;
  background: ${props => props.color};
  transition: 200ms;

  :hover {
    transform: ${props => (props.hoverEffect ? 'scale(1.1)' : null)};
  }
`

const Name = styled.div`
  margin-top: 12px;
  color: #fff;
  text-align: center;
  font-weight: 600;
  font-size: 28px;
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

interface Props {
  players: Player[]
}
const Players: React.FC<Props> = ({ players }) => {
  const [showSelector, setShowSelector] = useState(false)
  const transitions = useTransition(showSelector, null, {
    config: { tension: 400 },
    from: { transform: 'scale(0)', opacity: 0 },
    enter: { transform: 'scale(1)', opacity: 1 },
    leave: { transform: 'scale(0)', opacity: 0 },
  })

  if (!store.game || !store.game.player || !store.gsConfig) return null

  const { pattern, id: playerId } = store.game.player
  const { PATTERNS } = store.gsConfig
  const lockedPatterns = Object.values(store.game.players)
    .filter(player => player.pattern !== pattern)
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
    <Container>
      {players.map(player => (
        <PlayerContainer key={player.id}>
          {player.id === playerId ? (
            <Pattern
              color={player.pattern}
              onClick={handlePatternClick}
              hoverEffect
            />
          ) : (
            <Pattern color={player.pattern} />
          )}
          <Name>{player.name}</Name>

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

export default observer(Players)
