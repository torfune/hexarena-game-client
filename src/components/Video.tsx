import styled from 'styled-components'

const Container = styled.div<{ width: string; height: string }>`
  background: #222;
  overflow: hidden;
  border-radius: 4px;
  width: ${props => props.width};
  height: ${props => props.height};
  border: 1px solid #000;
`

interface Props {}
// const Video =

export default Container
