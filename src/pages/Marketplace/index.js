import React from 'react'
import styled from 'styled-components'

import BackButton from '../../shared/BackButton'

import brazil from './brazil.svg'
import canada from './canada.svg'
import france from './france.svg'
import germany from './germany.svg'
import russia from './russia.svg'
import spain from './spain.svg'

const Container = styled.div`
  padding: 72px;
`

const PatternContainer = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
`

const PatternAndPriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
`

const Headding = styled.h2`
  text-align: center;
`

const Pattern = styled.img`
  height: 72px;
  width: 72px;
`

const Description = styled.p`
  margin-left: 24px;
`

const Price = styled.p`
  font-size: 18px;
`

const Marketplace = () => (
  <Container>
    <Headding>Marketplace</Headding>
    <BackButton />
    <PatternAndPriceContainer>
      <PatternContainer>
        <Pattern src={brazil} alt="brazil" />
        <Description>Brazil</Description>
      </PatternContainer>
      <Price>15 $</Price>
    </PatternAndPriceContainer>
    <PatternAndPriceContainer>
      <PatternContainer>
        <Pattern src={canada} alt="canada" />
        <Description>Canada</Description>
      </PatternContainer>
      <Price>15 $</Price>
    </PatternAndPriceContainer>
    <PatternAndPriceContainer>
      <PatternContainer>
        <Pattern src={france} alt="france" />
        <Description>France</Description>
      </PatternContainer>
      <Price>15 $</Price>
    </PatternAndPriceContainer>
    <PatternAndPriceContainer>
      <PatternContainer>
        <Pattern src={germany} alt="germany" />
        <Description>Germany</Description>
      </PatternContainer>
      <Price>15 $</Price>
    </PatternAndPriceContainer>
    <PatternAndPriceContainer>
      <PatternContainer>
        <Pattern src={russia} alt="russia" />
        <Description>Russia</Description>
      </PatternContainer>
      <Price>15 $</Price>
    </PatternAndPriceContainer>
    <PatternAndPriceContainer>
      <PatternContainer>
        <Pattern src={spain} alt="spain" />
        <Description>Spain</Description>
      </PatternContainer>
      <Price>15 $</Price>
    </PatternAndPriceContainer>
  </Container>
)

export default Marketplace
