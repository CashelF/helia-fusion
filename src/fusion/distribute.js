import { unixfs } from '@helia/unixfs'

/**
 * Stores encoded data shards in Helia and returns their CIDs.
 * @param {Object} helia - The Helia instance.
 * @param {Buffer[]} shards - Array of encoded data shards.
 * @returns {Promise<string[]>} - Array of CIDs for the stored shards.
 */
export async function storeshards(helia, shards) {
  const fs = unixfs(helia)

  console.log('Storing shards:', shards)
  
  // Store each shard in Helia and collect the CIDs
  const cids = await Promise.all(shards.map(async (shard) => {
    const cid = await fs.addBytes(shard)
    console.log(`Stored shard with CID: ${cid.toString()}`)
    console.log(`Stored shard with CID: ${cid.toString()}`)
    return cid.toString() // Convert CID to string
  }))

  return cids
}

/**
 * Retrieves stored shards from Helia using their CIDs.
 * @param {Object} helia - The Helia instance.
 * @param {string[]} cids - Array of CIDs for the shards.
 * @returns {Promise<Buffer[]>} - Array of retrieved data shards.
 */
export async function retrieveshards(helia, cids) {
  const fs = unixfs(helia)
  
  // Retrieve each shard by CID
  const shards = await Promise.all(cids.map(async (cid) => {
    const content = []
    for await (const chunk of fs.cat(cid)) {
      content.push(chunk)
    }
    console.log(`Retrieved shard for CID: ${cid}`)
    return Buffer.concat(content)
  }))

  return shards
}

// import { unixfs } from '@helia/unixfs'

// /**
//  * Stores encoded data shards in Helia and returns their CIDs.
//  * @param {Object} helia - The Helia instance.
//  * @param {Buffer[]} shards - Array of encoded data shards.
//  * @returns {Promise<string[]>} - Array of CIDs for the stored shards.
//  */
// export async function storeshards(helia, shards) {
//   const fs = unixfs(helia)
  
//   try {
//     // Store each shard in Helia and collect the CIDs
//     const cids = await Promise.all(shards.map(async (shard) => {
//       const cid = await fs.addBytes(shard)
//       console.log(`Stored shard with CID: ${cid.toString()}`)
//       return cid.toString() // Convert CID to string
//     }))
//     return cids
//   } catch (error) {
//     console.error('Error storing shards:', error)
//     throw error
//   }
// }

// /**
//  * Retrieves stored shards from Helia using their CIDs.
//  * @param {Object} helia - The Helia instance.
//  * @param {string[]} cids - Array of CIDs for the shards.
//  * @returns {Promise<Buffer[]>} - Array of retrieved data shards.
//  */
// export async function retrieveshards(helia, cids) {
//   const fs = unixfs(helia)
  
//   try {
//     // Retrieve each shard by CID
//     const shards = await Promise.all(cids.map(async (cid) => {
//       const content = []
//       for await (const chunk of fs.cat(cid)) {
//         content.push(chunk)
//       }
//       console.log(`Retrieved shard for CID: ${cid}`)
//       return Buffer.concat(content)
//     }))
//     return shards
//   } catch (error) {
//     console.error('Error retrieving shards:', error)
//     throw error
//   }
// }
