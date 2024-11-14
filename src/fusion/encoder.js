import { encode, decode } from 'reed-solomon-erasure'

export function encodeData(data) {
  return encode(data, 10, 5) // 10 data, 5 parity
}

export function decodeData(fragments) {
  return decode(fragments)
}