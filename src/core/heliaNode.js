import { createHelia } from 'helia'

async function initHelia() {
  const helia = await createHelia()
  console.log('Helia node is running')
  return helia
}

initHelia()