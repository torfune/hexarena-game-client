import dynamic from 'next/dynamic'

const Play = dynamic(() => import('../src/pages/Play'), { ssr: false })

export default () => <Play />
