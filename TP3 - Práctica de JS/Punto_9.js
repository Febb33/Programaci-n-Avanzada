
// Tema: Promesas + control de tiempo

// withTimeout
function withTimeout(promise, ms) {
  
    return new Promise((resolve, reject) => {
  
        const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    promise
      .then(v => { clearTimeout(timer); resolve(v); })
      .catch(e => { clearTimeout(timer); reject(e); });
  });
}

// allSettledLite
function allSettledLite(promises) {
  
    return Promise.all(promises.map(p =>
  
        p.then(
      value => ({ status: 'fulfilled', value }),
      reason => ({ status: 'rejected', reason })
    )
  ));
}

const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
allSettledLite([p1,p2]).then(console.log);

const slow = new Promise(r => setTimeout(() => r('ok'), 2000));
withTimeout(slow, 1000).catch(console.error); // Acá da el error de timeout
