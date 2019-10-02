import styled from 'styled-components'
import { PRIMARY } from '../constants/react'

const Heading = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;

  > span {
    color: ${PRIMARY};
  }
`
export default Heading
