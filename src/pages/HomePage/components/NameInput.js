import styled from 'styled-components'

import { BOX_SHADOW } from '../../../constants'

const NameInput = styled.input.attrs({
  placeholder: 'Guest 42',
  maxLength: 12,
})`
  display: block;
  background: #666;
  outline: none;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  padding-left: 12px;
  height: 40px;
  box-sizing: border-box;
  width: auto;
  box-shadow: ${BOX_SHADOW};
  color: #fff;

  ::placeholder {
    color: #ccc;
  }
`

export default NameInput
