import { createNode } from './core/heliaNode.js'
import { storeFile, retrieveFile } from './fusion/distribute.js'
import { unixfs } from '@helia/unixfs'
import * as fileSys from 'fs/promises'
import { initHeliaNodeWithIpns } from './fusion/ipns.js';

async function main() {
  // Initialize 2 Primary Nodes
  const primaryNode1 = await createNode();
  const primFS1 = unixfs(primaryNode1)
  const primaryNode2 = await createNode();
  const primFS2 = unixfs(primaryNode2)

  // Connect the 2 Primary Nodes
  const multiaddrsPrim = primaryNode1.libp2p.getMultiaddrs()
  await primaryNode2.libp2p.dial(multiaddrsPrim)

  // Initialize 1 Backup Node
  const backupNode1 = await createNode();
  const { ipnsManager: backupIPNSManager, privateKey: backupPrivateKey } = await initHeliaNodeWithIpns(backupNode1);
  const backupFS1 = unixfs(backupNode1)
  const backupFilesystems = [backupFS1]
  const backupNodes = [backupNode1]

  // Store a file on primaryNode1 and distribute to backup nodes
  const fileContent = await fileSys.readFile('./hello-world.txt')
  const fileObject = { content: fileContent };
  const cid = await storeFile(primFS1, backupFilesystems, primaryNode1, backupNodes, backupIPNSManager, backupPrivateKey, fileObject);

  console.log(`File stored with CID: ${cid}`);

  // Attempt to retrieve the file from primaryNode1
  try {
    const retrievedData = await retrieveFile(primFS1, cid.toString());
    console.log('Retrieved File Content');
  } catch (error) {
    console.error('Error retrieving shard:', error);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});