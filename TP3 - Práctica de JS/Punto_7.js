
// Tema: Map/Set + Strings

function wordFreq(text) {

    const map = new Map();
  const clean = text.toLowerCase().replace(/[.,:;!?]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  for (let w of words) {
    map.set(w, (map.get(w) || 0) + 1);
  }

  return map;
}

console.log(wordFreq("Hola, hola! chau.")); // Map { hola => 2, chau => 1 }
