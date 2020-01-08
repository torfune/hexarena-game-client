import styled from 'styled-components'
import React from 'react'
import { ActionType } from '../../game/classes/Action'
import { COLOR, PRIMARY } from '../../constants/react'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import GameServerConfig from '../../types/GameServerConfig'
import Tile from '../../game/classes/Tile'

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Circle = styled.div`
  border-radius: 50%;
  background: #222;
  border: 1px solid ${COLOR.HUD_BORDER};
  width: 74px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

const Rectangle = styled.div`
  border-radius: 12px;
  background: ${COLOR.HUD_BACKGROUND};
  border: 1px solid ${COLOR.HUD_BORDER};
  position: relative;
  left: -30px;
  padding-left: 42px;
  display: flex;
  color: #fff;
  height: 56px;
`

const MainSection = styled.div`
  padding-top: 4px;
  margin-right: 16px;
`

const CostSection = styled.div`
  border-left: 1px solid ${COLOR.HUD_BORDER};
  text-align: center;
  padding-bottom: 1px;
`

const CostLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 3px;
  padding-top: 3px;
  border-bottom: 1px solid ${COLOR.HUD_BORDER};
  color: #aaa;
`

const CostValue = styled.p<{ red: boolean }>`
  font-size: 26px;
  font-weight: 600;
  margin-top: 1px;
  color: ${props => (props.red ? '#e84118' : '#fff')};
`

const ClickToStart = styled.p`
  color: #aaa;
  font-size: 16px;
  margin-top: 1px;
`

const NotEnoughGold = styled.div`
  background: ${PRIMARY};
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 3px;
`

const Icon = styled.img<{ opaque: boolean }>`
  height: 34px;
  filter: invert(1);
  opacity: ${props => (props.opaque ? '0.6' : 1)};
`

const Label = styled.p`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-top: 1px;
`

interface Props {
  actionType: ActionType | 'SEND_ARMY'
  tile: Tile
}
const ActionPreview: React.FC<Props> = ({ actionType, tile }) => {
  if (!store.game || !store.config || !store.game.player) return null

  const cost = getActionCost(
    actionType,
    store.config,
    tile.forest ? tile.forest.treeCount : 0
  )
  const gold = store.game.player.gold
  const enoughGold = gold >= cost

  return (
    <Container>
      <Circle>
        <Icon src={getActionIcon(actionType)} opaque={!enoughGold} />
      </Circle>
      <Rectangle>
        <MainSection>
          <Label>{getActionLabel(actionType)}</Label>
          {enoughGold ? (
            <ClickToStart>{getActionDescription(actionType)}</ClickToStart>
          ) : (
            <NotEnoughGold>NOT ENOUGH GOLD</NotEnoughGold>
          )}
        </MainSection>
        {actionType !== 'SEND_ARMY' && (
          <CostSection>
            <CostLabel>COST</CostLabel>
            <CostValue red={!enoughGold}>{cost}</CostValue>
          </CostSection>
        )}
      </Rectangle>
    </Container>
  )
}

const getActionLabel = (actionType: ActionType | 'SEND_ARMY' | 'REPAIR') => {
  if (!store.game || !store.game.hoveredTile) return

  switch (actionType) {
    // case 'CAPTURE':
    //   const structure = store.game.hoveredTile.getStructureName()
    //   return `Capture ${structure || 'Tile'}`
    // case 'CAMP':
    //   return 'Build Camp'
    case 'TOWER':
      return 'Build Tower'
    case 'CASTLE':
      return 'Build Castle'
    case 'SEND_ARMY':
      return 'Send army'
  }
}

const getActionIcon = (actionType: ActionType | 'SEND_ARMY' | 'REPAIR') => {
  if (!store.game || !store.game.hoveredTile) return

  switch (actionType) {
    // case 'CAPTURE':
    //   const structure = store.game.hoveredTile.getStructureName()
    //   return `/game/static/images/${
    //     structure ? structure.toLowerCase() : 'tile'
    //   }-icon.png`
    // case 'CAMP':
    //   return '/game/static/images/camp-icon.png'
    case 'TOWER':
      return '/game/static/images/tower-icon.png'
    case 'CASTLE':
      return '/game/static/images/castle-icon.png'
    case 'REPAIR':
      return '/game/static/images/hpFill.png'
    case 'SEND_ARMY':
      return '/game/static/icons/army.svg'
  }
}

const getActionCost = (
  actionType: ActionType | 'SEND_ARMY',
  config: GameServerConfig,
  treeCount: number
) => {
  switch (actionType) {
    // case 'CAPTURE':
    //   if (!store.game || !store.game.hoveredTile) return 1
    //   return store.game.hoveredTile.captureCost()
    // case 'CAMP':
    //   return config.CAMP_COST - treeCount
    case 'TOWER':
      return config.TOWER_COST - treeCount
    case 'CASTLE':
      return config.CASTLE_COST
    case 'SEND_ARMY':
      return 0
  }
}

const getActionDescription = (
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR'
) => {
  if (!store.game) return null

  if (actionType === 'SEND_ARMY' && !store.game.selectedArmyTile) {
    return 'Drag & drop to send army'
  }

  return 'Click to start'
}

export default observer(ActionPreview)
