import { FC } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const Loader = dynamic(() => import('../src/components/Loader'), { ssr: false })

const App: FC<any> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>HexArena.io</title>
    </Head>

    <Loader>
      <Component {...pageProps} />
    </Loader>
  </>
)

export default App
