import { CID } from 'multiformats/cid';

export async function storeFile(primaryFs, backupFs, fileContent) {
  const cid = addFileToPrimary(primaryFs, fileContent);
  
  // get the fused file from one of the backup nodes, then re-fuse the files and replace the shards in the backup nodes
  for (const fs of backupFs) {
    addFileToBackup(fs, fileContent);
  }

  return cid;
}

async function addFileToPrimary(fs, fileContent) {
  const cid = await fs.add(fileContent); // Store file in primary network
  console.log(`File added to primary network with CID: ${cid}`);
  return cid;
}

async function addFileToBackup(fs, fileContent) {
  // retrieve the file from the backup network, then re-fuse the files and replace the shards in the backup
  
  
  const shardCids = await getShardsCids(fs, 1); // CID 1 is the root CID of the backup file (potentially)
  const shards = await retrieveShards(fs, shardCids); // Retrieve the shards
  //now just shard up the fileContent, and reed solomon it with the shards retrieved from the backup, then replace everything with the new file generated from that
  
}

async function getShardsCids(fs, rootCid) {
  const dagNode = await fs.get(rootCid); // Fetch the DAG root node
  const links = dagNode.Links; // Links to child shards

  return links.map(link => link.Cid); // Return the CIDs of individual shards
}

async function retrieveShards(fs, shardCids) {
  const shards = [];

  for (const cid of shardCids) {
    const shardData = [];
    for await (const chunk of fs.cat(cid)) {
      shardData.push(chunk);
    }
    shards.push(Buffer.concat(shardData));
  }

  return shards;
}


export async function retrieveFile(fs, cidString) {
  try {
    // Step 1: Parse the CID
    const cid = CID.parse(cidString);

    // Step 2: Retrieve the shard using Helia's `cat` method
    const retrievedData = [];
    for await (const chunk of fs.cat(cid)) {
      retrievedData.push(chunk);
    }

    console.log('Shard successfully retrieved');
    return Buffer.concat(retrievedData);
  } catch (error) {
    console.error('Failed to retrieve shard:', error);
    throw error;
  }
}