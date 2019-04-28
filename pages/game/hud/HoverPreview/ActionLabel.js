import React from 'react'
import styled from 'styled-components'

const Plus = styled.span`
  font-size: 22px;
  font-weight: 600;
  margin-right: -4px;
  position: relative;
  top: -1px;
`

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

const ActionLabel = ({ label }) => (
  <Container>
    {renderIconByLabel(label)}
    <h4>{label}</h4>
  </Container>
)

const renderIconByLabel = label => {
  let src = null

  switch (label) {
    case 'Cancel action':
      src = '/static/icons/cross.svg'
      break
    case 'Capture':
      src = '/static/icons/swords.svg'
      break
    case 'Build castle':
      src = '/static/icons/resources.svg'
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
