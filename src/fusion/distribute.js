import { addFile } from '../core/storage.js'

export async function storeFragments(helia, fragments) {
  return await Promise.all(fragments.map(f => addFile(helia, f)))
}
