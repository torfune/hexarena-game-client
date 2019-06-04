import styled from 'styled-components'
import { LOGO_SHADOW, PRIMARY, BOX_SHADOW } from '../../constants/react'
import React from 'react'
// import { version } from '../../package.json'
const version = '1.16.0'

const Container = styled.h1`
  color: #fff;
  font-weight: 700;
  font-size: 64px;
  text-shadow: ${LOGO_SHADOW};
  width: 410px;
  position: relative;
`

const Badge = styled.div`
  background: ${PRIMARY};
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 500;
  position: absolute;
  right: 0;
  text-align: center;
  box-shadow: ${BOX_SHADOW};
`

interface Props {
  hideBadge?: boolean
}
const Logo: React.FC<Props> = ({ hideBadge }) => (
  <Container>
    HexArena.io
    {!hideBadge && <Badge>Alpha {version}</Badge>}
  </Container>
)

export default Logo
