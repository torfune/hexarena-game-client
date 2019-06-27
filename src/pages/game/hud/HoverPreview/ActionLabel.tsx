import styled from 'styled-components'
import React from 'react'

const Icon = styled.img`
  height: 20px;
  margin-right: 8px;
`

const Container = styled.div`
  display: flex;
  padding-right: 12px;
  padding-bottom: 6px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    white-space: nowrap;
  }
`

interface Props {
  label: string
  iconSrc?: string
}
const ActionLabel: React.FC<Props> = ({ label, iconSrc }) => (
  <Container>
    {iconSrc && <Icon src={iconSrc} />}
    <h4>{label}</h4>
  </Container>
)

export default ActionLabel
