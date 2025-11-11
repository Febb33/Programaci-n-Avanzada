
const { Kafka } = require('kafkajs');
const WebSocket = require('ws');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'gateway-group' });
const wss = new WebSocket.Server({ port: 4001 });

console.log('Servidor WebSocket del Gateway en ejecución (puerto 4001)');

const subs = new Map();

wss.on('connection', ws => {
  console.log('Nuevo cliente WebSocket conectado');

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.action === 'subscribe' && data.transactionId) {
        subs.set(ws, data.transactionId);
        console.log(`Cliente suscripto a la transacción: ${data.transactionId}`);
      }
    } catch (err) {
      console.error('Mensaje WebSocket inválido:', err);
    }
  });

  ws.on('close', () => {
    subs.delete(ws);
    console.log('Cliente WebSocket desconectado');
  });
});


async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'txn.events', fromBeginning: false });
  console.log('Gateway conectado al tópico de Kafka txn.events');

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const key = message.key.toString();
        const ev = JSON.parse(message.value.toString());
        console.log(`Evento recibido: ${ev.type} (TX: ${key})`);

        for (const [ws, txId] of subs.entries()) {
          if (txId === key) {
            ws.send(JSON.stringify(ev));
            console.log(`Evento ${ev.type} enviado al cliente (${txId})`);
          }
        }
      } catch (err) {
        console.error('Error al procesar mensaje de Kafka:', err);
      }
    },
  });
}

start().catch(err => console.error('Error al iniciar el Gateway:', err));

