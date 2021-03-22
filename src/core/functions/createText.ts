import { Text, TextStyle } from 'pixi.js-legacy'
import store from '../store'

const createText = (content: string) => {
  const text = new Text(
    content,
    new TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 44,
      fontWeight: '600',
      fill: '#333',
    })
  )

  text.anchor.set(0.5, 0.5)

  if (store.game && store.game.pixi) {
    store.game.pixi.stage.addChild(text)
  }

  return text
}

export default createText
