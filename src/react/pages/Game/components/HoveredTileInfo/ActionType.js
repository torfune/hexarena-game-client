import React from 'react'
import styled from 'styled-components'
import swordsSrc from '../../../../../assets/icons/swords.svg'
import hammerSrc from '../../../../../assets/icons/resources.svg'
import axeSrc from '../../../../../assets/icons/axe.svg'
import armySrc from '../../../../../assets/icons/army.svg'

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

  h4 {
    font-size: 18px;
    font-weight: 600;
    margin-left: 8px;
  }
`

const ActionType = ({ label }) => (
  <Container>
    {renderIconByLabel(label)}
    <h4>{label}</h4>
  </Container>
)

const renderIconByLabel = label => {
  let src = null

  switch (label) {
    case 'Capture':
      src = swordsSrc
      break
    case 'Build tower':
      src = hammerSrc
      break
    case 'Get wood':
      src = axeSrc
      break
    case 'Recruit army':
      src = armySrc
      break
    default:
  }

  if (!src) return null

  if (label === 'Recruit') {
    return (
      <div>
        <Plus>+</Plus>
        <Icon src={src} />
      </div>
    )
  }

  return <Icon src={src} />
}

export default ActionType
