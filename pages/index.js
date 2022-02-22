import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Multichain & Exchange API</title>
        <meta name="description" content="Multichain & Exchange API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Yeeho
        </h1>

        <p>
          A simple aggregator for both exchange data (FTX & Binance) as well as (most) DeFi tokens.
        </p>

        <p>
          It tracks the net USD value of multiple addresses on Fantom, Ethereum, Polygon, Avalanche, and Binance Smart Chain.
        </p>

        <p>
          It gets the net value of your Futures contracts as well as spot positions through the CCXT library.
        </p>

        <p>
          Currently supports FTX and Binance. Can add more api keys once I get some to test with!
        </p>

        <p>
          dm me on <a href="https://twitter.com/itspublu" rel="noreferrer" target="_blank">twitter.com</a> to collab.
        </p>

        <p className={styles.description}>
          Get started by making a POST call to {' '}
          <code className={styles.code}>https://yeho.vercel.app/api/data</code>
        </p>

        <p>
          Example Request
        </p>
        <code className={styles.code}>
          {`{
            "addresses": [
              "0xbc8d100e2c7c1d6bbefc3128bd5185d226a1976a","0x9dcc35ae915926f7f5e8c624254d91f755d55b71","0x7ba7f4773fa7890bad57879f0a1faa0edffb3520","0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3"
            ]
          }`}
        </code>

        <form method="post" action="/api/data" target="_blank">
          <input type="hidden" name="addresses" id="fname" value={'["0xbc8d100e2c7c1d6bbefc3128bd5185d226a1976a","0x9dcc35ae915926f7f5e8c624254d91f755d55b71","0x7ba7f4773fa7890bad57879f0a1faa0edffb3520","0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3"]'} />
          <button type="submit" name="dev" value="true">
            Try it out
          </button>
        </form>

        <p>
          Example of how you can organize the data
        </p>
        <code className={styles.table}>
          {
`-----------------------------------------------------------------
$$$  eth  0x9dcc35ae915926f7f5e8c624254d91f755d55b71 tokens  $$$
------------------------------------------------------------------
╔═══════╤═══════════╤═══════╤══════════════╤══════════╤═════════╗
║ name  │ USD       │ ratio │ FTM          │ price    │ count   ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ TOTAL │ $40705967 │ 100%  │ f13614035.79 │ $0       │ 0       ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ XCH   │ $40697862 │ 100%  │ f13611325.08 │ $136.51  │ 298131  ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ ETH   │ $3911     │ 0%    │ f1308.03     │ $4445.2  │ 0.88    ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ SPUNK │ $2181     │ 0%    │ f729.43      │ $242.44  │ 9       ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ VSD   │ $1358     │ 0%    │ f454.18      │ $0.67628 │ 2008.51 ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ GNO   │ $516      │ 0%    │ f172.58      │ $438.09  │ 1.18    ║
╟───────┼───────────┼───────┼──────────────┼──────────┼─────────╢
║ DONA  │ $139      │ 0%    │ f46.49       │ $138.38  │ 1.01    ║
╚═══════╧═══════════╧═══════╧══════════════╧══════════╧═════════╝
          `}
        </code>

        <p className={styles.description}>
          You can also include FTX and Binance data by adding the apiKey & secrets (make sure they&apos;re read only!)
        </p>

        <code className={styles.code}>
          {`{
            "keys": {
              "ftx": {
                "apiKey": "-KOS1MRZ",
                "secret": "-"
              },
              "binance": {
                "apiKey": "lxFwkKUV9QbVn6JMRuafrwH",
                "secret": "Zr0peI1zOlALV5TjrHj3eNGNTd2FtGm"
              }
            },
            "addresses": [
              "0xxx",
              "0xxx"
            ]
          }`}
        </code>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
