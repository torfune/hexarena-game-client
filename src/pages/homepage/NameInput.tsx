import styled from 'styled-components'

const NameInput = styled.input.attrs({
  maxLength: 12,
})`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 18px;
  background: #fff;
  font-weight: 500;
  margin-right: 16px;
  color: #333;
  width: 240px;
  height: 40px;

  :hover,
  :focus {
    color: #000;
  }

  ::placeholder {
    color: #aaa;
  }
`

export default NameInput