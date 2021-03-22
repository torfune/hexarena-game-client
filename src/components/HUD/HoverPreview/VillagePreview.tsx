import styled from 'styled-components'
import React from 'react'
import { COLOR } from '../../../constants/constants-react'
import villageIcon from '../../../icons/village.svg'

interface Props {
  villageIncome: number
}
const VillagePreview = ({ villageIncome }: Props) => (
  <Container>
    <Icon src={villageIcon} />
    <div>
      <Label>Village</Label>
      <IncomeDescription>
        Produces {villageIncome} gold per minute
      </IncomeDescription>
    </div>
  </Container>
)

const Container = styled.div`
  padding: 6px 12px;
  background: ${COLOR.GREY_600};
  border: 1px solid ${COLOR.GREY_800};
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
  font-size: 16px;
  color: #fff;
  opacity: 0.5;
`
const Icon = styled.img`
  filter: invert(1);
  height: 32px;
  margin-right: 10px;
`

export default VillagePreview
