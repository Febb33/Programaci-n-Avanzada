
// Tema: Arrays + Objetos + HOF

function groupBy(list, keyOrFn) {
  
    const result = {};
  
    list.forEach(item => {
    const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
    if (!result[key]) result[key] = [];
    result[key].push(item);
  });
  
  return result;
}

console.log(groupBy([{t:'a'}, {t:'b'}, {t:'a'}], 't'));
console.log(groupBy([6, 7, 8, 9], n => n%2?'impar':'par'));
