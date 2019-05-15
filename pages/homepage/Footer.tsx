import styled from 'styled-components'
import { PRIMARY } from '../../constants/react'

const Container = styled.footer`
  margin-top: auto;
  color: #fff;
  text-align: center;
  padding: 64px 128px;
  background: #2f2f2f;
`

const Name = styled.span`
  color: ${PRIMARY};
  font-size: 18px;
  font-weight: 600;
  padding: 0 4px;
`

const Footer: React.FC = () => (
  <Container>
    Game by <Name>Matej Strnad</Name> &amp; <Name>Katarina Cvetkovicova</Name>
  </Container>
)

export default Footer
