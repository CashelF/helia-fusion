import { unixfs } from '@helia/unixfs'

export async function addFile(helia, content) {
  const fs = unixfs(helia)
  return await fs.addBytes(content)
}

export async function getFile(helia, cid) {
  const fs = unixfs(helia)
  const content = []
  for await (const chunk of fs.cat(cid)) {
    content.push(chunk)
  }
  return Buffer.concat(content)
}