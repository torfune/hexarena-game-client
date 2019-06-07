import styled, { css } from 'styled-components'
import shadeColor from '../utils/shade'

interface Props {
  color: string
  scale?: number
}
const Pattern = styled.div<Props>`
  ${({ color, scale = 1 }) => css`
    width: calc(18px * ${scale});
    height: calc(18px * ${scale});
    border-radius: calc(4px * ${scale});
    background: ${color};
    border: 1px solid ${shadeColor(color, -10)};
  `}
`

export default Pattern
