import ReedSolomon from 'reed-solomon-erasure'
const { encode, decode } = ReedSolomon

export function encodeData(data) {
  return encode(data, 10, 5) // 10 data, 5 parity
}

export function decodeData(fragments) {
  return decode(fragments)
}