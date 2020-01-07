import dynamic from 'next/dynamic'

const Spectate = dynamic(() => import('../src/pages/Spectate'), { ssr: false })

export default () => <Spectate />
