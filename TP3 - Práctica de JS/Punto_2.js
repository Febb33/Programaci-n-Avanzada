
// Tema: Objetos + Funciones puras

function pick(obj, keys) {
  
    const result = {};
  
    keys.forEach(k => {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      result[k] = obj[k];
    }
  });

  return result;
}

console.log(pick({a:1, b:2, c:3}, ['a', 'c', 'z']));
