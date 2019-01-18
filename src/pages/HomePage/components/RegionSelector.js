import React from 'react'
import styled from 'styled-components'

const StyledSelect = styled.select`
  margin-top: 16px;
  width: 72px;
  font-size: 18px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px;
`

const StyledOption = styled.option`
  font-size: 18px;
`

const RegionSelector = () => (
  <StyledSelect>
    <StyledOption value="eu">eu</StyledOption>
    <StyledOption value="us">us</StyledOption>
  </StyledSelect>
)

export default RegionSelector
