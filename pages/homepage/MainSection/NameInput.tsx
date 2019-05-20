import styled from 'styled-components'
import { BOX_SHADOW } from '../../../constants/react'

const NameInput = styled.input.attrs({
  maxLength: 12,
})`
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: ${BOX_SHADOW};
  font-size: 24px;
  background: #eee;
  font-weight: 500;
  margin-right: 16px;
  color: #333;
  width: 240px;

  :hover,
  :focus {
    background: #fff;
  }

  ::placeholder {
    color: #aaa;
  }
`

export default NameInput
