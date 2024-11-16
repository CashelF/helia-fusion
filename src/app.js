import { initHelia } from './core/heliaNode.js'
import { decodeData, encodeData } from './fusion/encoder.js'
import { storeshards, retrieveshards } from './fusion/distribute.js'

async function main() {
  const helia = await initHelia()
  
  const data = Buffer.from('Hello, fault-tolerant world!')
  const other_data = Buffer.from('Bye, fault-tolerant world!')
  const buffer = encodeData(data)
  const other_buffer = encodeData(other_data)
  // turn shards into a list of buffers
  const shards = [buffer, other_buffer]



  console.log('Encoded shards:', shards)
  const cids = await storeshards(helia, shards)
  console.log('Stored CIDs:', cids)

  const recoveredData = await retrieveshards(helia, cids);
  for (let i = 0; i < recoveredData.length; i++) {
    const decodedData = decodeData(recoveredData[i]);
    console.log('Recovered Data:', new TextDecoder().decode(decodedData));
  }
}

main()

// import { initHelia } from './core/heliaNode.js'
// import { BackupStack, LinkedList, PrimNode, AuxNode, FusedNode } from './fusion/fusion.js' // Assuming fusion logic is in this module
// import { storeshards, retrieveshards } from './fusion/distribute.js'

// async function main() {
//   const helia = await initHelia()

//   // Initialize the primary and backup data structures
//   const primLinkedList = new LinkedList(); // For primaries
//   const auxLinkedList = new LinkedList(); // For backups
//   const backupStack = new BackupStack(); // Handles the fusion and fault-tolerant logic

//   // Simulate some data
//   const data = Buffer.from('Hello, fault-tolerant world!');
//   console.log('Original Data:', data.toString());

//   // Insert data at Primaries (this would simulate a primary node inserting data)
//   backupStack.insertAtPrimaries("key1", data.toString(), primLinkedList);

//   // Insert data at Backups (this would simulate the backup nodes receiving and processing the data)
//   backupStack.insertAtBackups("key1", data.toString(), null, auxLinkedList);

//   // Perform checks to see the system is working
//   console.log('Checking Primaries and Backups:');

//   // Check the primary node (whether data exists)
//   if (primLinkedList.contains("key1")) {
//     console.log('Primary Node has data for key1:', primLinkedList.get("key1").value);
//   } else {
//     console.log('Primary Node does not have data for key1');
//   }

//   // Check the backup node (whether fused data exists)
//   for (let i = 0; i < auxLinkedList.length; i++) {
//     if (auxLinkedList[i].contains("key1")) {
//       const fusedNode = auxLinkedList[i].get("key1").fusedNode;
//       console.log(`Backup ${i} has fused data for key1:`, fusedNode.value);
//     } else {
//       console.log(`Backup ${i} does not have data for key1`);
//     }
//   }

//   // Simulate data retrieval from backups
//   const cids = await storeshards(helia, data);
//   console.log('Stored CIDs:', cids);

//   // Simulate data retrieval and fusion from backups
//   const recoveredData = await retrieveshards(helia, cids);
//   console.log('Recovered Data:', recoveredData.toString());

//   // Simulate deletion of data at Primaries and Backups
//   console.log('Deleting data from Primaries and Backups:');
//   backupStack.deleteAtPrimaries("key1", primLinkedList);
//   backupStack.deleteAtBackups("key1", data.toString(), ["tosValue"]);

//   // Perform checks after deletion to ensure data is removed
//   console.log('Post-deletion checks:');
//   if (!primLinkedList.contains("key1")) {
//     console.log('Primary Node no longer has data for key1');
//   }

//   for (let i = 0; i < auxLinkedList.length; i++) {
//     if (!auxLinkedList[i].contains("key1")) {
//       console.log(`Backup ${i} no longer has data for key1`);
//     }
//   }
// }

// main()
