import { observer } from 'mobx-react-lite'
import { useTransition, animated } from 'react-spring'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { HUD_SCALE } from '../../../constants/react'
import store from '../../../store'
import Header from '../../../components/Header'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-top: none;
  position: absolute;
  top: 0;
  user-select: none;
  width: 256px;
  transform-origin: left top;
  transform: scale(${HUD_SCALE});
  height: 128px;
`

const Content = styled.div`
  padding: 0 30px;
  padding-bottom: 16px;
`

const Coins = styled.div`
  margin-top: 24px;
`

const Coin = styled(animated.img)`
  height: 32px;
`

interface GoldItem {
  key: string
}

const GoldSection = () => {
  const [gold, setGold] = useState<GoldItem[]>([])
  const transitions = useTransition(gold, (item: { key: string }) => item.key, {
    from: { transform: 'scale(2, 2)', opacity: 0 },
    enter: { transform: 'scale(1.2, 1.2)', opacity: 1 },
    leave: { transform: 'scale(2, 2)', opacity: 0 },
  })

  useEffect(() => {
    const diff = store.gold - gold.length

    if (diff > 0) {
      const newGold = [...gold]

      for (let i = 0; i < diff; i++) {
        newGold.push({ key: String(newGold.length) })
      }

      setGold(newGold)
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        const newGold = gold
        newGold.pop()
        setGold(newGold)
      }
    }
  }, [store.gold])

  return (
    <Container>
      <Header
        text="Gold"
        iconSrc="/static/icons/resources.svg"
        iconSize="22px"
      />
      <Content>
        <Coins>
          {transitions.map(
            ({ item, props, key }) =>
              item && (
                <Coin key={key} style={props} src="/static/icons/gold.svg" />
              )
          )}
        </Coins>
      </Content>
    </Container>
  )
}

export default observer(GoldSection)
