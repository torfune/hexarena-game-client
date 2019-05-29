import { observer } from 'mobx-react-lite'
import { animated, useTransition } from 'react-spring'
import styled from 'styled-components'
import store from '../../../store'
import Header from '../../../components/Header'
import { useState, useEffect } from 'react'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-top: none;
  position: absolute;
  top: 0;
  user-select: none;
  width: 180px;
  transform-origin: left top;
  transform: scale(${store.hudScale});
  height: 128px;
`

const Content = styled.div`
  display: flex;
  padding: 0 30px;
  align-items: center;
  height: 80px;
  justify-content: space-between;
`

const Coin = styled(animated.img)`
  height: 38px;
`

const Count = styled.p<{ top: number }>`
  font-size: 40px;
  color: #444;
  position: absolute;
  top: ${props => props.top}px;
  text-align: center;
  transition: 500ms;
  width: 64px;
  line-height: 80px;
`

const CountMask = styled.div`
  position: relative;
  top: 0px;
  height: 80px;
  width: 64px;
  overflow: hidden;
`

const numbers: number[] = []
for (let i = 0; i <= 64; i++) {
  numbers.push(i)
}

const BASE_TOP = 0
const ROW_HEIGHT = 80

const GoldSection = () => {
  const [top, setTop] = useState(BASE_TOP)

  useEffect(() => {
    const top = BASE_TOP + store.gold * ROW_HEIGHT * -1
    setTop(top)
  }, [store.gold])

  return (
    <Container>
      <Header
        text="Gold"
        iconSrc="/static/icons/resources.svg"
        iconSize="22px"
      />
      <Content>
        <Coin src="/static/icons/gold.svg " />
        <CountMask>
          <Count top={top}>
            {numbers.map(number => (
              <p>{number}</p>
            ))}
          </Count>
        </CountMask>
      </Content>
    </Container>
  )
}

export default observer(GoldSection)
