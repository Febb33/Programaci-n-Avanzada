
// Tema: Objetos + Recursividad

function deepEqual(a, b) {

    if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(k => deepEqual(a[k], b[k]));
}

console.log(deepEqual({x:[1,2]}, {x:[1,2]})); // true
console.log(deepEqual({x:1}, {x:'1'})); // false
