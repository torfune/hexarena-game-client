import styled from 'styled-components'
import React from 'react'
import { ActionType } from '../../../core/classes/Action'
import { COLOR } from '../../../constants/constants-react'
import { observer } from 'mobx-react-lite'
import store from '../../../core/store'
import Tile from '../../../core/classes/Tile'
import recruitIcon from '../../../icons/recruit.svg'
import armyIcon from '../../../icons/army.svg'
import ArmyDragManager from '../../../core/classes/ArmyDragManager'

const baseImageUrl = process.env.PUBLIC_URL + '/images'

interface Props {
  actionType: ActionType | 'SEND_ARMY'
  tile: Tile
}
const ActionPreview = ({ actionType, tile }: Props) => {
  if (
    !store.game ||
    !store.gsConfig ||
    !store.game.player ||
    store.game.supplyLinesEditModeActive
  ) {
    return null
  }

  if (
    (!tile.action || tile.action.status !== 'PREVIEW') &&
    actionType !== 'SEND_ARMY'
  ) {
    return null
  }

  const cost = actionType !== 'SEND_ARMY' ? tile.getActionCost(actionType) : 0
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

const getActionLabel = (
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING'
) => {
  switch (actionType) {
    case 'BUILD_CAMP':
      return 'Build Camp'
    case 'BUILD_TOWER':
      return 'Build Tower'
    case 'BUILD_CASTLE':
      return 'Build Castle'
    case 'RECRUIT_ARMY':
      return 'Train Army'
    case 'REBUILD_VILLAGE':
      return 'Rebuild Village'
    case 'REPAIR_BUILDING':
      return 'Repair building'
    case 'SEND_ARMY':
      return 'Send army'
  }
}

const getActionIcon = (
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING'
) => {
  switch (actionType) {
    case 'BUILD_CAMP':
      return `${baseImageUrl}/camp-icon.png`
    case 'BUILD_TOWER':
      return `${baseImageUrl}/tower-icon.png`
    case 'BUILD_CASTLE':
      return `${baseImageUrl}/castle-icon.png`
    case 'RECRUIT_ARMY':
      return recruitIcon
    case 'REBUILD_VILLAGE':
      return `${baseImageUrl}/repair-icon.png`
    case 'REPAIR_BUILDING':
      return `${baseImageUrl}/repair-icon.png`
    case 'SEND_ARMY':
      return armyIcon
  }
}

const getActionDescription = (
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING'
) => {
  if (!store.game) return null

  if (actionType === 'SEND_ARMY' && !ArmyDragManager.active) {
    return 'Drag & drop to send army'
  }

  return 'Click to start'
}

const Container = styled.div`
  display: flex;
  align-items: center;
`
const Circle = styled.div`
  border-radius: 50%;
  background: ${COLOR.GREY_800};
  width: 74px;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`
const Rectangle = styled.div`
  border-radius: 12px;
  background: ${COLOR.GREY_600};
  border: 1px solid ${COLOR.GREY_800};
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
  border-left: 1px solid ${COLOR.GREY_800};
  text-align: center;
  padding-bottom: 1px;
`
const CostLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  padding: 3px 16px;
  border-bottom: 1px solid ${COLOR.GREY_800};
  color: #fff;
  opacity: 0.5;
`
const CostValue = styled.p<{ red: boolean }>`
  font-size: 26px;
  font-weight: 600;
  margin-top: 1px;
  color: ${(props) => (props.red ? '#e84118' : '#fff')};
`
const ClickToStart = styled.p`
  color: #fff;
  opacity: 0.5;
  font-size: 16px;
  margin-top: 1px;
`
const NotEnoughGold = styled.div`
  background: ${COLOR.RED};
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 12px;
  font-weight: 600;
  margin-top: 3px;
`
const Icon = styled.img<{ opaque: boolean; dontInvert?: boolean }>`
  height: 34px;
  filter: invert(1);
  opacity: ${(props) => (props.opaque ? '0.6' : 1)};
`
const Label = styled.p`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-top: 1px;
`

export default observer(ActionPreview)
