import styled from 'styled-components'
import { SHADOW } from '../../constants/react'

const NameInput = styled.input.attrs({
  maxLength: 12,
})`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 18px;
  background: #fff;
  font-weight: 500;
  margin-right: 16px;
  color: #444;
  width: 240px;
  height: 40px;
  box-shadow: ${SHADOW.BUTTON};

  :hover,
  :focus {
    color: #000;
  }

  ::placeholder {
    color: #aaa;
  }
`

export default NameInput
