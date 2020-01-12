import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import { useTransition } from 'react-spring'
import React, { useState, FC } from 'react'
import Player from '../../game/classes/Player'
import PatternSelector from './PatternSelector'
import { TRANSITION } from '../../constants/react'

interface Props {
  players: Player[]
  hideNames?: boolean
}
const Players: FC<Props> = ({ players, hideNames }) => {
  const [showSelector, setShowSelector] = useState(false)
  const transitions = useTransition(showSelector, null, TRANSITION.SCALE)

  if (!store.game || !store.game.player || !store.config) return null

  const { pattern, id: playerId } = store.game.player
  const { PATTERNS } = store.config
  const lockedPatterns = Array.from(store.game.players.values())
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
          <Name>{hideNames ? '???' : player.name}</Name>

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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 700px;
`
const PlayerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #242424;
  border-radius: 20px;
  height: 180px;
  width: 180px;
  padding-top: 8px;
  position: relative;
  margin: 16px 0;
`
const Pattern = styled.div<{ color: string; hoverEffect?: boolean }>`
  width: 96px;
  height: 96px;
  border-radius: 20px;
  background: ${props => props.color};
  transition: 200ms;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px;

  :hover {
    transform: ${props => (props.hoverEffect ? 'scale(1.1)' : null)};
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 16px;
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
