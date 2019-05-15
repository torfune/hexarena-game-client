import dynamic from 'next/dynamic'

const DynamicGame = dynamic(() => import('./Game'), {
  ssr: false,
})

function Game() {
  return (
    <>
      <DynamicGame />
    </>
  )
}

export default Game
