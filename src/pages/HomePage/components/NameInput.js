import styled from 'styled-components'

const NameInput = styled.input.attrs({
  placeholder: 'Guest 42',
  maxLength: 12,
})`
  display: block;
  background: none;
  outline: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding-left: 12px;
  height: 34px;
  box-sizing: border-box;
  width: auto;
`

export default NameInput
