import { GenericGF, ReedSolomonEncoder } from './reedsolomon.js';

const numFaults = 1; // Number of faults to tolerate

/**
 * Initializes a Reed-Solomon encoder with the specified field.
 */
function initEncoder() {
  const field = GenericGF.QR_CODE_FIELD_256(); // Use 256-symbol Galois field
  return new ReedSolomonEncoder(field);
}

/**
 * Combines an existing backup shard with a primary shard using XOR.
 * @param {Buffer} existingBackup - The existing backup shard.
 * @param {Buffer} primaryShard - The primary shard to combine.
 * @returns {Buffer} The combined shard.
 */
function combineShards(existingBackup, primaryShard) {
  return Buffer.concat([existingBackup, primaryShard]);
}

/**
 * Generates parity shards from a list of combined shards.
 * @param {Array<Buffer>} combinedShards - The combined shards (primary + existing backup).
 * @param {number} parityLength - The number of parity bytes to generate per shard.
 * @returns {Array<Buffer>} The parity shards.
 */
function generateParityShards(combinedShards, parityLength = numFaults * 1024 * 1024) { 
  const encoder = initEncoder();
  const parityShards = combinedShards.map((shard) => {
    const shardBuffer = new Int32Array([...shard]); // Convert Buffer to Int32Array
    const fullBuffer = new Int32Array(shardBuffer.length + parityLength);
    fullBuffer.set(shardBuffer);

    // encoder.encode(fullBuffer, parityLength); // Generate parity bytes in place
    // ^ maybe is too slow, struggling encoding 1024 KB
    return Buffer.from(fullBuffer.buffer, fullBuffer.byteLength - parityLength, parityLength);
  });

  return parityShards;
}

export { combineShards, generateParityShards };