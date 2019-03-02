import React from 'react'
import styled from 'styled-components'

import { BOX_SHADOW } from '../../../constants'

const Container = styled.div`
  margin-top: 24px;
`

const Label = styled.p`
  color: #fff;
`

const Pattern = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: ${props => props.color};
  margin-right: 16px;
  box-shadow: ${BOX_SHADOW};
  position: relative;

  ::after {
    position: absolute;
    bottom: -12px;
    content: '';
    width: 100%;
    height: 4px;
    background: ${props => (props.isSelected ? '#fff' : null)};
  }
`

const List = styled.div`
  display: flex;
  margin-top: 12px;
`

const PatternSelector = ({ patterns, selected, onChange }) => {
  return (
    <Container>
      <Label>Select color</Label>

      <List>
        {patterns.map(color => (
          <Pattern
            key={color}
            color={color}
            isSelected={selected === color}
            onClick={() => {
              onChange(color)
            }}
          />
        ))}
      </List>
    </Container>
  )
}

export default PatternSelector
