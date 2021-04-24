import styled from 'styled-components'
import React from 'react'
import { ActionType } from '../../../core/classes/Action'
import { COLOR } from '../../../constants/constants-react'
import { observer } from 'mobx-react-lite'
import store from '../../../core/store'
import Tile from '../../../core/classes/Tile'
import recruitIcon from '../../../icons/recruit.svg'
import armyIcon from '../../../icons/army.svg'
import ArmySendManager from '../../../core/classes/ArmySendManager'

const baseImageUrl = process.env.PUBLIC_URL + '/images'

interface Props {
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING'
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

  const cost = getActionCost(actionType, tile)
  const gold = store.game.player.gold
  const enoughGold = gold >= cost

  return (
    <Container>
      <Circle>
        <Icon
          src={getActionIcon(actionType)}
          opaque={!enoughGold}
          dontInvert={actionType === 'REPAIR_BUILDING'}
        />
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
      return recruitIcon // TODO: add proper icon
    case 'REPAIR_BUILDING':
      return `${baseImageUrl}/hp-fill.png`
    case 'SEND_ARMY':
      return armyIcon
  }
}

const getActionCost = (
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING',
  tile: Tile
) => {
  if (!store.gsConfig) return 0

  const treeCount = tile.forest ? tile.forest.treeCount : 0

  switch (actionType) {
    case 'BUILD_CAMP':
      return store.gsConfig.BUILD_CAMP_COST - treeCount
    case 'BUILD_TOWER':
      return store.gsConfig.BUILD_TOWER_COST
    case 'BUILD_CASTLE':
      return store.gsConfig.BUILD_CASTLE_COST
    case 'RECRUIT_ARMY':
      return store.gsConfig.RECRUIT_ARMY_COST
    case 'REPAIR_BUILDING':
      return store.gsConfig.RECRUIT_ARMY_COST
    case 'REBUILD_VILLAGE':
      return tile.village
        ? tile.village.level * store.gsConfig.VILLAGE_HOUSE_VALUE * 2
        : 0
    case 'SEND_ARMY':
      return 0
  }
}

const getActionDescription = (
  actionType: ActionType | 'SEND_ARMY' | 'REPAIR_BUILDING'
) => {
  if (!store.game) return null

  if (actionType === 'SEND_ARMY' && !ArmySendManager.active) {
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
  filter: ${(props) => (props.dontInvert ? null : 'invert(1)')};
  opacity: ${(props) => (props.opaque ? '0.6' : 1)};
`
const Label = styled.p`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-top: 1px;
`

export default observer(ActionPreview)
