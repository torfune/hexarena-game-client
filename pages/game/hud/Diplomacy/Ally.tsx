import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Player from '../../../../game/classes/Player'
import Hexagon from '../../../../components/Hexagon'

const Container = styled.div``

const AllyWrapper = styled.div`
  padding-top: 24px;
  display: flex;
  align-items: center;
`

const Name = styled.p`
  margin-left: 16px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
`

const TilesCount = styled.p`
  font-size: 20px;
  margin-left: auto;
  color: #666;
  font-weight: 300;
`

const Skull = styled.img`
  width: 40px;
  opacity: 0.8;
`

interface DiedTextProps {
  visible: boolean
}

const DiedText = styled.p<DiedTextProps>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
  font-size: 14px;
  font-weight: 500;
  color: #666;
  text-align: center;
  margin-top: 8px;
  padding: 8px 32px;
  font-style: italic;
`

interface Props {
  ally: Player
}

const Ally: React.FC<Props> = ({ ally }) => (
  <Container>
    <AllyWrapper>
      {ally.alive ? (
        <Hexagon size="40px" color={ally.pattern} />
      ) : (
        <Skull src="/static/icons/skull.svg" />
      )}
      <Name>{ally.name}</Name>

      <TilesCount>{ally.tilesCount}</TilesCount>
    </AllyWrapper>

    <DiedText visible={!ally.alive}>Your ally is dead.</DiedText>
  </Container>
)

export default observer(Ally)
