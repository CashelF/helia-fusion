import { CID } from 'multiformats/cid';
import * as dagPb from '@ipld/dag-pb';
import { combineShards, generateParityShards } from './encoder.js';
import { getCidFromIPNS, latestBackupCID, setLatestBackupCID } from './ipns.js';
import { peerIdFromCID } from '@libp2p/peer-id';


export async function storeFile(primaryFs, backupFs, primNode, backupNode, backupIPNSManager, backupPrivateKey, fileObject) {
  // console.log(primNode.blockstore.pins.getCodec());
  // console.log(primNode.pins.getCodec());
  console.log("ADD TO PRIMARY");

  const cid = await addFileToPrimary(primaryFs, fileObject);
  // console.log("Dag Type: ", cid.code);
  // console.log(primNode.blockstore.pins.getCodec(cid));


  const primShardCids = await getAllShardsCids(primNode, cid);
  const primShards = await retrieveShards(primaryFs, primShardCids);
  
  console.log("ADD TO BACKUP");
  addFileToBackup(backupNode, backupFs, backupIPNSManager, backupPrivateKey, primShards);

  return cid;
}

async function addFileToPrimary(fs, fileObject) {
  const cid = await fs.addFile(fileObject); // Store file in primary network
  console.log(`File added to primary network with CID: ${cid}`);
  return cid;
}

async function addFileToBackup(node, fs, backupIPNSManager, backupPrivateKey, primShards) {
  // Step 1: Retrieve existing backup shards or initialize empty buffers
  let backupShardCids;
  try {
    const backupDAGCid = await backupIPNSManager.resolve(backupPrivateKey.publicKey);
    backupShardCids = await getAllShardsCids(node, latestBackupCID); // make backupDAGCid when IPNS is working
  } catch {
    console.log('No existing backup.');
    backupShardCids = [];
  }

  const backupShards = await retrieveShards(fs, backupShardCids);

  // Step 2: Combine primary shards with existing backup shards
  const combinedShards = primShards.map((primaryShard, i) => {
    return i < backupShards.length ? combineShards(backupShards[i], primaryShard) : primaryShard;
  });

  // console.log('Combined shards len:', combinedShards.length);

  // Step 3: Generate parity shards
  const parityShards = generateParityShards(combinedShards);

  // Step 4: Store updated parity shards back into the backup
  const newBackupCids = [];
  for (const shard of parityShards) {
    const cid = await fs.addBytes(shard); // is addBytes the right one to use? i need something that adds just 1 shard
    newBackupCids.push(cid);
    console.log(`Updated backup shard stored with CID: ${cid}`);
  }

  const rootBackupCid = await fs.addDirectory(newBackupCids);
  // console.log(`New backup DAG root CID: ${rootBackupCid}`);
  setLatestBackupCID(rootBackupCid);

  // console.log("backupPrivateKey: ", backupPrivateKey);
  // await backupIPNSManager.publish(peerIdFromCID(rootBackupCid), rootBackupCid);
  // console.log(`Published new root CID to IPNS: ${rootBackupCid}`);

  console.log('Backup updated successfully.');
}

async function getAllShardsCids(node, rootCid) {
  const result = [];
  const stack = [rootCid];

  while (stack.length > 0) {
    const currentCid = stack.pop();
    if(currentCid.code != 112) { // Only traverse the DAG if it's a dag-pb node
      result.push(currentCid); // Add leaf nodes to the result
      continue;
    }

    try {
      // Retrieve the current DAG node
      const dagNode = await getDagNode(node, currentCid);
      console.log(`Processing node CID: ${currentCid}`);

      dagNode.Links.forEach(link => {
        stack.push(link.Hash);  // Continue traversal for deeper links
      });
    } catch (error) {
      console.error(`Failed to retrieve node for CID ${currentCid}:`, error.message);
    }
  }

  console.log(`Retrieved ${result.length} shard CIDs.`);
  return result;
}

async function getDagNode(node, cid) {
  const blockstore = node.blockstore;

  try {
    // Retrieve the raw block from the blockstore
    const rawBlock = await blockstore.get(cid);

    // Decode the block as a DAG-PB node
    const dagNode = dagPb.decode(rawBlock);

    // // Process the shards (links in the DAG node)
    // const shardCIDs = dagNode.Links.map(link => link.Hash);
    // console.log('Shard CIDs:', shardCIDs);

    return dagNode;
  } catch (error) {
    console.error('Failed to retrieve DAG node:', error.message);
    throw error;
  }
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