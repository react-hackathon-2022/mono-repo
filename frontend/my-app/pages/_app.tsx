import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NhostClient, NhostReactProvider } from '@nhost/react'

const nhost = new NhostClient({
  subdomain: 'vanefmkgqsuxooyznwml',
  region: 'ap-south-1'
})

function MyApp({ Component, pageProps }: AppProps) {
  return  <NhostReactProvider nhost={nhost}><Component {...pageProps} /></NhostReactProvider>
}

export default MyApp
