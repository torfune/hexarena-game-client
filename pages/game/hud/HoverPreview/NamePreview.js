import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding-bottom: 8px;
  padding-left: 10px;
  padding-right: 12px;
  display: flex;
`

const Label = styled.h4`
  font-size: 18px;
  margin-left: 8px;
  margin-right: 10px;
  font-weight: 600;
`

const Icon = styled.img`
  height: 20px;
`

const NamePreview = ({ name }) => (
  <Container>
    <Icon src="/static/icons/player.svg" />
    <Label>{name}</Label>
  </Container>
)

export default NamePreview
