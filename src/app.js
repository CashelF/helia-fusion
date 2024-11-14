import { initHelia } from './core/heliaNode.js'
import { encodeData } from './fusion/encoder.js'
import { storeFragments, retrieveAndReconstruct } from './fusion/distribute.js'

async function main() {
  const helia = await initHelia()
  
  const data = Buffer.from('Hello, fault-tolerant world!')
  const fragments = encodeData(data)

  const cids = await storeFragments(helia, fragments)
  console.log('Stored CIDs:', cids)

  const recoveredData = await retrieveAndReconstruct(helia, cids)
  console.log('Recovered Data:', recoveredData.toString())
}

main()