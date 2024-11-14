import { getFile } from '../core/storage.js'
import { decodeData } from './encoder.js'

export async function retrieveAndReconstruct(helia, cids) {
  const fragments = await Promise.all(cids.map(cid => getFile(helia, cid)))
  return decodeData(fragments)
}