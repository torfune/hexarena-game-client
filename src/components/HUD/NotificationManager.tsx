import store from '../../core/store'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { animated, useTransition } from 'react-spring'
import { Pixel } from '../../types/coordinates'
import { BOX_SHADOW } from '../../constants/react'

const Notification = styled(animated.div)<{ position: Pixel }>`
  position: absolute;
  left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
  background: #f33;
  z-index: 999;
  border-radius: 4px;
  padding: 8px 16px;
  box-shadow: ${BOX_SHADOW};
  text-transform: uppercase;
  font-size: 16px;
  color: #fff;
  font-weight: 700;
`

interface Notification {
  key: string
  position: Pixel
  text: string
}

const NotificationManager: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([])
  const transitions = useTransition(items, (item) => item.key, {
    config: {
      tension: 100,
    },
    from: { transform: 'translate3d(0,20px,0)', opacity: 0.8 },
    enter: { transform: 'translate3d(0,0,0)', opacity: 1 },
    leave: { transform: 'translate3d(0,-80px,0)', opacity: 0 },
  })

  const itemsRef = useRef(items)
  itemsRef.current = items

  if (!store.game) return null

  useEffect(() => {
    if (!store.game) return

    if (store.game.notification && store.game.cursor) {
      const [key, text] = store.game.notification.split('|')

      for (let i = 0; i < items.length; i++) {
        if (items[i].key === key) return
      }

      const notification = {
        key,
        position: {
          x: store.game.cursor.x,
          y: store.game.cursor.y,
        },
        text,
      }

      setItems([...itemsRef.current, notification])

      setTimeout(() => {
        const items = itemsRef.current
        if (items) {
          setItems(items.filter((item) => item.key !== key))
        }
      }, 750)
    }
  }, [store.game.notification])

  return (
    <>
      {transitions.map(({ item, props, key }) => (
        <Notification key={key} style={props} position={item.position}>
          {item.text}
        </Notification>
      ))}
    </>
  )
}

export default observer(NotificationManager)
