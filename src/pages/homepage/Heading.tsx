import styled from 'styled-components'
import { PRIMARY } from '../../constants/react'

const Heading = styled.h3<{ red?: boolean }>`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${props => (props.red ? PRIMARY : '#aaa')};
  white-space: nowrap;

  span {
    color: ${PRIMARY};
    font-weight: 700;
    white-space: nowrap;
    margin-left: 4px;
  }
`

export default Heading
