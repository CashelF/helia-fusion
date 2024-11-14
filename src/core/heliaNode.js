import { createHelia } from 'helia'

export async function initHelia() {
  const helia = await createHelia()
  console.log('Helia node is running')
  return helia
}