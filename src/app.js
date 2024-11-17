import { createNode } from './core/heliaNode.js'
import { storeShard, retrieveShard } from './fusion/distribute.js'

async function main() {
  // Initialize 2 Primary Nodes
  const primaryNode1 = await createNode();
  const primaryNode2 = await createNode();

  // Connect the 2 Primary Nodes
  const multiaddrsPrim = primaryNode1.libp2p.getMultiaddrs()
  await primaryNode2.libp2p.dial(multiaddrsPrim)

  // Initialize 2 Backup Nodes
  const backupNode1 = await createNode();
  const backupNode2 = await createNode();

  // Connect the 2 Backup Nodes
  const multiaddrsBack = backupNode1.libp2p.getMultiaddrs()
  await backupNode2.libp2p.dial(multiaddrsBack)

  // Get Backup Peer IDs
  // const backupPeerIds = [
  //   backupNode1.libp2p.peerId.toString(),
  //   backupNode2.libp2p.peerId.toString(),
  // ];
  // console.log(`Backup Peer IDs: ${backupPeerIds}`);

  // Store a file on primaryNode1 and distribute to backup nodes
  const fileContent = Buffer.from('Hello, distributed world!');
  const cid = await storeShard(primaryNode1.fs, primaryNode1.libp2p.contentRouting, fileContent, backupPeerIds);

  console.log(`File stored with CID: ${cid}`);

  // Attempt to retrieve the file from primaryNode1
  try {
    const retrievedData = await retrieveShard(primaryNode1.fs, cid.toString());
    console.log('Retrieved Shard Content:', retrievedData.toString());
  } catch (error) {
    console.error('Error retrieving shard:', error);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});