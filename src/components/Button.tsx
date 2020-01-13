import styled from 'styled-components'

interface Props {
  children: React.ReactNode
  onClick: () => void
  color: string
}
const Button: React.FC<Props> = ({ children, onClick, color }) => (
  <Container onClick={onClick} color={color}>
    {children}
  </Container>
)

const Container = styled.div<{ color: string }>`
  width: 240px;
  height: 40px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 250ms;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px;
  justify-content: center;
  margin: 0 auto;
  background: ${props => props.color};

  :hover {
    box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 24px;
    transform: scale(1.05);
  }
`

export default Button
