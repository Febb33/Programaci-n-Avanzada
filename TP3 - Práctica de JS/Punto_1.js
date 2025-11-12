
// Tema: Arrays + Set + Funciones

function sumUnique(nums) {
  
  // Filtra los valores que sean numéros finitos
  const validNums = nums.filter(n => Number.isFinite(n));

  // El set elimina duplicados
  const unique = [...new Set(validNums)];

  return unique.reduce((acc, n) => acc + n, 0);
}

console.log(sumUnique([1, '2', 2, 3, 'a'])); // → 6
