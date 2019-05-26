import game from '../../../game'
import styled from 'styled-components'
import { PRIMARY, SECONDARY } from '../../../constants/react'

const Container = styled.div`
  background: ${PRIMARY};
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 64px;
  border-radius: 4px;
  width: 260px;
  margin: 0 16px;
  transition: 100ms;
  position: absolute;
  bottom: 96px;
  left: 50vw;
  transform: translateX(-130px);
  text-align: center;
  z-index: 10;
  box-shadow: 0px 4px 16px #00000022;

  :hover {
    background: ${SECONDARY};
  }
`

const SurrenderButton = () => (
  <Container onClick={game.surrender.bind(game)}>Surrender</Container>
)

export default SurrenderButton
