
// Tema: Funciones de orden superior + timers

function debounce(fn, delay) {

    let timer;

    return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const log = debounce(() => console.log("Ejecutado!"), 1000);
log(); log(); log(); // Se ejecuta después del delay
