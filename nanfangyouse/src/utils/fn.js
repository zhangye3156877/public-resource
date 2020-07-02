export function copy(payload) {
  if (typeof payload !== 'object' || payload === null) {
    return payload;
  }
  const o = Array.isArray(payload) ? [] : {};
  
}