import { ipns } from '@helia/ipns';
import { generateKeyPair } from '@libp2p/crypto/keys';

export let latestBackupCID; // Placeholder until I get the IPNS stuff working
export function setLatestBackupCID(cid) {
    latestBackupCID = cid;
  }

export async function initHeliaNodeWithIpns(heliaNode) {
    const ipnsManager = ipns(heliaNode);
  
    // Create a keypair if one doesn't exist for this session
    const privateKey = await generateKeyPair('Ed25519');
    
    return { ipnsManager, privateKey };
}

export async function getCidFromIPNS(heliaNode, keyName) {
    const keys = await heliaNode.libp2p.services.keychain.listKeys();
  
    if (!keys.some(key => key.name === keyName)) {
      throw new Error(`IPNS key "${keyName}" does not exist.`);
    }
  
    const peerId = await heliaNode.libp2p.services.keychain.exportPeerId(keyName);
    const resolvedCid = await heliaNode.ipns.resolve(peerId);
  
    console.log(`Resolved backup file CID: ${resolvedCid}`);
    return resolvedCid;
}
  
  