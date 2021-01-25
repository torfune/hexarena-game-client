import styled from 'styled-components'
import React from 'react'
import { COLOR } from '../../../constants/react'

const Container = styled.div`
  padding: 6px 12px;
  background: ${COLOR.HUD_BACKGROUND};
  border: 1px solid ${COLOR.HUD_BORDER};
  border-radius: 8px;
  color: #fff;
  display: flex;
  align-items: center;
`

const Label = styled.p`
  font-weight: 500;
  font-size: 20px;
`

const IncomeDescription = styled.p`
  color: #aaa;
  font-size: 14;
`

const Icon = styled.img`
  filter: invert(1);
  height: 32px;
  margin-right: 10px;
`

interface Props {
  villageIncome: number
}
const VillagePreview: React.FC<Props> = ({ villageIncome }) => (
  <Container>
    <Icon src="/static/icons/village.svg" />
    <div>
      <Label>Village</Label>
      <IncomeDescription>
        Produces {villageIncome} gold per minute
      </IncomeDescription>
    </div>
  </Container>
)

export default VillagePreview
