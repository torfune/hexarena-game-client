import { useState } from 'react'
import styled from 'styled-components'
import { useTransition } from 'react-spring'
import PatternSelector from './PatternSelector'
import { BOX_SHADOW } from '../../../../constants/react'
import Player from '../../../../game/classes/Player'
import Hexagon from '../../../../components/Hexagon'
import store from '../../../../store'

interface ContainerProps {
  empty: boolean
  zIndex?: number
}
const Container = styled.div<ContainerProps>`
  margin: 0 32px;
  border-radius: 8px;
  padding-top: 24px;
  box-shadow: ${props => (!props.empty ? BOX_SHADOW : null)};
  background: ${props => (!props.empty ? '#fff' : null)};
  min-height: 252px;
  width: 220px;
  position: relative;
  z-index: ${props => props.zIndex || 1};
`

const PatternWrapper = styled.div`
  margin: 0 auto;
  width: 140px;
  position: relative;
  top: 8px;
`

interface NameProps {
  empty: boolean
}
const Name = styled.p<NameProps>`
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-top: 40px;
  width: 220px;
  padding: 12px 0;
  background: #eee;
  overflow: hidden;
  display: ${props => (props.empty ? 'none' : null)};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`

const ChangePatternLabel = styled.div`
  position: absolute;
  width: 140px;
  text-align: center;
  padding: 4px 0;
  background: rgba(0, 0, 0, 0.1);
  color: #fff;
  display: none;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 14px;
  user-select: none;
  top: 60px;

  ${PatternWrapper}:hover & {
    display: block;
  }
`

interface Props {
  name: string | null
  pattern: string | null
  isThisPlayer: boolean
  players: Player[]
  onPatternSelect: (pattern: string) => void
}
const PlayerAvatar: React.FC<Props> = ({
  name,
  pattern,
  isThisPlayer,
  players,
  onPatternSelect,
}) => {
  if (!store.gsConfig) return null

  if (!isThisPlayer) {
    return (
      <Container empty={!name}>
        <PatternWrapper>
          <Hexagon color={pattern || '#3f3f3f'} size="140px" />
        </PatternWrapper>
        <Name empty={!name}>{name || ''}</Name>
      </Container>
    )
  }

  const { PATTERNS } = store.gsConfig
  const lockedPatterns = players
    .filter(player => player.pattern !== pattern)
    .map(({ pattern }) => pattern)

  const [showSelector, setShowSelector] = useState(false)
  const transitions = useTransition(showSelector, null, {
    config: { tension: 400 },
    from: { transform: 'scale(0)', opacity: 0 },
    enter: { transform: 'scale(1)', opacity: 1 },
    leave: { transform: 'scale(0)', opacity: 0 },
  })

  const handlePatternClick = () => {
    setShowSelector(true)
  }

  const handleClickOutside = () => {
    setShowSelector(false)
  }

  const handlePatternSelect = (pattern: string) => {
    if (lockedPatterns.includes(pattern)) return

    onPatternSelect(pattern)
    setShowSelector(false)
  }

  return (
    <Container empty={!name} zIndex={2}>
      <PatternWrapper onClick={handlePatternClick}>
        <Hexagon color={pattern || '#222'} size="140px" />
        <ChangePatternLabel>Change</ChangePatternLabel>
      </PatternWrapper>

      <Name empty={!name}>{name || ''}</Name>

      {transitions.map(
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

      {showSelector && <DarkOverlay onClick={handleClickOutside} />}
    </Container>
  )
}

export default PlayerAvatar
