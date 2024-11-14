import { initHelia } from './core/heliaNode.js'
import { encodeData } from './fusion/encoder.js'
import { storeFragments, retrieveFragments } from './fusion/distribute.js'

if (typeof global.CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(event, params = { bubbles: false, cancelable: false, detail: null }) {
      super(event, params);
      this.detail = params.detail;
    }
  };
}

async function main() {
  const helia = await initHelia()
  
  const data = Buffer.from('Hello, fault-tolerant world!')
  const fragments = encodeData(data)

  const cids = await storeFragments(helia, fragments)
  console.log('Stored CIDs:', cids)

  const recoveredData = await retrieveFragments(helia, cids)
  console.log('Recovered Data:', recoveredData.toString())
}

main()