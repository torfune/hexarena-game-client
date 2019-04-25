import React from 'react'
import styled from 'styled-components'
import { version } from '../../package.json'
import { LOGO_SHADOW, PRIMARY, BOX_SHADOW } from '../../constants/react'

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

const Logo = ({ hideBadge }) => (
  <Container>
    HexArena.io
    {!hideBadge && <Badge>Alpha {version}</Badge>}
  </Container>
)

export default Logo
