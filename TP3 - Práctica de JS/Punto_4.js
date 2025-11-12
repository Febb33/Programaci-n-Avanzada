
// Tema: Arrays + sort + comparadores

function sortByMany(list, specs) {
  
    const arr = [...list];
  
    arr.sort((a, b) => {
    for (let { key, dir } of specs) {
      const dirFactor = dir === 'desc' ? -1 : 1;
      if (a[key] < b[key]) return -1 * dirFactor;
      if (a[key] > b[key]) return 1 * dirFactor;
    }
    return 0; // iguales en todos los criterios
  });
  
  return arr;
}

const users = [{lastName:'Z', age:20}, {lastName:'A', age:30}, {lastName:'A', age:25}];
console.log(sortByMany(users, [{key:'lastName', dir:'asc'}, {key:'age', dir:'desc'}]));
