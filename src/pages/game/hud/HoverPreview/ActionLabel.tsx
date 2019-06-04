import styled from 'styled-components'
import React from 'react'

const Icon = styled.img`
  height: 20px;
`

const Container = styled.div`
  display: flex;
  padding-right: 12px;
  padding-bottom: 6px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-left: 8px;
  }
`

interface Props {
  label: string
}

const ActionLabel: React.FC<Props> = ({ label }) => (
  <Container>
    {renderIconByLabel(label)}
    <h4>{label}</h4>
  </Container>
)

const renderIconByLabel = (label: string) => {
  let src = null

  switch (label) {
    case 'Cancel action':
      src = '/static/icons/cross.svg'
      break
    case 'Capture':
      src = '/static/icons/swords.svg'
      break
    case 'Build castle':
      src = '/static/icons/castle.svg'
      break
    case 'Get gold':
      src = '/static/icons/axe.svg'
      break
    case 'Recruit army':
    case 'Send army':
      src = '/static/icons/army.svg'
      break
    default:
  }

  if (!src) return null

  return <Icon src={src} />
}

export default ActionLabel
