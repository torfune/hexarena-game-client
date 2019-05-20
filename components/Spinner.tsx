import styled from 'styled-components'

const Container = styled.div`
  display: inline-block;
  position: relative;
  width: 32px;
  height: 32px;
  margin-left: 16px;

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 6px;
    border: 4px solid #fed;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fed transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }
`

const Spinner = () => (
  <Container>
    <div />
    <div />
    <div />
    <div />
  </Container>
)

export default Spinner
