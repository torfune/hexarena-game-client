import React from 'react'
import styled from 'styled-components'
import Header from '../../../shared/Header'
import crownImagePath from '../../../../assets/icons/crown.svg'
import useStore from '../../../hooks/useStore'
import { observer } from 'mobx-react-lite'
import { HUD_SCALE } from '../../../constants'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  right: 0;
  min-height: 240px;
  width: 256px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  overflow: hidden;
  transform-origin: right bottom;
  transform: scale(${HUD_SCALE});
`

const Content = styled.div`
  padding: 8px 30px;
`

const Leader = styled.div`
  display: flex;
  opacity: ${props => props.opacity};
`

const Pattern = styled.div`
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: ${({ pattern }) => pattern};
  align-self: center;
  margin-right: 8px;
  position: relative;
  top: -1px;
`

const Name = styled.p`
  color: #222;
  font-weight: 500;
  margin: 8px 0;
  padding-right: 18px;
`

const TilesCount = styled.p`
  color: #222;
  font-weight: 500;
  width: 18px;
  margin: 8px 0 8px auto;
`

const Leaderboard = () => {
  const { players } = useStore()

  if (!players.length) return null

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.tilesCount > b.tilesCount) {
      return -1
    } else if (a.tilesCount < b.tilesCount) {
      return 1
    } else {
      return 0
    }
  })

  return (
    <Container>
      <Header text="Players" iconSrc={crownImagePath} iconSize="24px" />
      <Content>
        {sortedPlayers.map((l, i) => (
          <Leader key={i} opacity={l.alive ? 1 : 0.2}>
            <Pattern pattern={l.pattern} />
            <Name>{l.name}</Name>
            <TilesCount>{l.tilesCount}</TilesCount>
          </Leader>
        ))}
      </Content>
    </Container>
  )
}

export default observer(Leaderboard)
