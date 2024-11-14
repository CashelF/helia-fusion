import { unixfs } from '@helia/unixfs'

/**
 * Stores encoded data fragments in Helia and returns their CIDs.
 * @param {Object} helia - The Helia instance.
 * @param {Buffer[]} fragments - Array of encoded data fragments.
 * @returns {Promise<string[]>} - Array of CIDs for the stored fragments.
 */
export async function storeFragments(helia, fragments) {
  const fs = unixfs(helia)

  console.log('Storing fragments:', fragments)
  
  // Store each fragment in Helia and collect the CIDs
  const cids = await Promise.all(fragments.map(async (fragment) => {
    const cid = await fs.addBytes(fragment)
    console.log(`Stored fragment with CID: ${cid.toString()}`)
    console.log(`Stored fragment with CID: ${cid.toString()}`)
    return cid.toString() // Convert CID to string
  }))

  return cids
}

/**
 * Retrieves stored fragments from Helia using their CIDs.
 * @param {Object} helia - The Helia instance.
 * @param {string[]} cids - Array of CIDs for the fragments.
 * @returns {Promise<Buffer[]>} - Array of retrieved data fragments.
 */
export async function retrieveFragments(helia, cids) {
  const fs = unixfs(helia)
  
  // Retrieve each fragment by CID
  const fragments = await Promise.all(cids.map(async (cid) => {
    const content = []
    for await (const chunk of fs.cat(cid)) {
      content.push(chunk)
    }
    console.log(`Retrieved fragment for CID: ${cid}`)
    return Buffer.concat(content)
  }))

  return fragments
}

// import { unixfs } from '@helia/unixfs'

// /**
//  * Stores encoded data fragments in Helia and returns their CIDs.
//  * @param {Object} helia - The Helia instance.
//  * @param {Buffer[]} fragments - Array of encoded data fragments.
//  * @returns {Promise<string[]>} - Array of CIDs for the stored fragments.
//  */
// export async function storeFragments(helia, fragments) {
//   const fs = unixfs(helia)
  
//   try {
//     // Store each fragment in Helia and collect the CIDs
//     const cids = await Promise.all(fragments.map(async (fragment) => {
//       const cid = await fs.addBytes(fragment)
//       console.log(`Stored fragment with CID: ${cid.toString()}`)
//       return cid.toString() // Convert CID to string
//     }))
//     return cids
//   } catch (error) {
//     console.error('Error storing fragments:', error)
//     throw error
//   }
// }

// /**
//  * Retrieves stored fragments from Helia using their CIDs.
//  * @param {Object} helia - The Helia instance.
//  * @param {string[]} cids - Array of CIDs for the fragments.
//  * @returns {Promise<Buffer[]>} - Array of retrieved data fragments.
//  */
// export async function retrieveFragments(helia, cids) {
//   const fs = unixfs(helia)
  
//   try {
//     // Retrieve each fragment by CID
//     const fragments = await Promise.all(cids.map(async (cid) => {
//       const content = []
//       for await (const chunk of fs.cat(cid)) {
//         content.push(chunk)
//       }
//       console.log(`Retrieved fragment for CID: ${cid}`)
//       return Buffer.concat(content)
//     }))
//     return fragments
//   } catch (error) {
//     console.error('Error retrieving fragments:', error)
//     throw error
//   }
// }
