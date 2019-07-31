import styled from 'styled-components'
import { PRIMARY } from '../../constants/react'

const Heading = styled.h3<{ red?: boolean }>`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 600;
  color: ${props => (props.red ? PRIMARY : '#aaa')};

  span {
    color: ${PRIMARY};
    font-weight: 600;
    white-space: nowrap;
    font-size: 20px;
    margin-left: 4px;
  }
`

export default Heading
