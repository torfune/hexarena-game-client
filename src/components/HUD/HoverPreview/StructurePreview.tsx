import styled from 'styled-components'
import React from 'react'
import { COLOR } from '../../../constants/constants-react'

const Container = styled.div`
  padding: 6px 12px;
  background: ${COLOR.GREY_600};
  border: 1px solid ${COLOR.GREY_800};
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  font-size: 18px;
`

interface Props {
  structure: string
}
const StructurePreview: React.FC<Props> = ({ structure }) => (
  <Container>{structure}</Container>
)

export default StructurePreview
