import { ReedSolomonEncoder, ReedSolomonDecoder, GenericGF } from './reedsolomon.js';

/**
 * Encode data using Reed-Solomon error correction.
 * @param {Uint8Array} data - The data to encode.
 * @param {number} parityBytes - Number of parity bytes to add for error correction.
 * @returns {Uint8Array} - The encoded data including parity bytes.
 */
export function encodeData(data, parityBytes = 10) { // Default value for parityBytes is 10
  const totalLength = data.length + parityBytes;
  const toEncode = new Uint8Array(totalLength);
  toEncode.set(data); // Copy data into the first part of the array

  const field = GenericGF.QR_CODE_FIELD_256();
  const encoder = new ReedSolomonEncoder(field);

  encoder.encode(toEncode, parityBytes);
  return toEncode;
}

/**
 * Decode data and correct errors using Reed-Solomon error correction.
 * @param {Uint8Array} data - The data to decode.
 * @param {number} parityBytes - Number of parity bytes used during encoding.
 * @returns {Uint8Array} - The corrected data.
 * @throws {Error} - If decoding fails due to too many errors.
 */
export function decodeData(data, parityBytes) {
  const field = GenericGF.QR_CODE_FIELD_256();
  const decoder = new ReedSolomonDecoder(field);

  const received = new Int32Array(data); // Convert to Int32Array for decoding

  decoder.decode(received, parityBytes);

  // Extract the original data
  return new Uint8Array(received.subarray(0, data.length - parityBytes));
}