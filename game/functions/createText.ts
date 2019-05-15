import game from '..'

const createText = (content: string, stageName: string) => {
  const text = new PIXI.Text(
    content,
    new PIXI.TextStyle({
      fontFamily: 'Montserrat',
      fontSize: 44,
      fontWeight: '600',
      fill: '#333',
    })
  )

  text.anchor.set(0.5, 0.5)
  game.stage[stageName].addChild(text)

  return text
}

export default createText
