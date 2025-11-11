
const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'orchestrator-group' });
const producer = kafka.producer();

function esperar(ms) {
  return new Promise(r => setTimeout(r, ms));
}


async function start() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'txn.commands', fromBeginning: true });


  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const event = JSON.parse(message.value.toString());
      console.log('Orquestador recibió:', event.type, key);

      try {
        await esperar(500);
        const reservado = {
          type: 'FundsReserved',
          transactionId: key,
          timestamp: Date.now(),
          payload: { ok: true, amount: event.payload.amount },
        };
        await producer.send({ topic: 'txn.events', messages: [{ key, value: JSON.stringify(reservado) }] });

        await esperar(500);
        const riesgo = Math.random() < 0.9 ? 'BAJO' : 'ALTO';
        const fraude = {
          type: 'FraudChecked',
          transactionId: key,
          timestamp: Date.now(),
          payload: { risk: riesgo },
        };
        await producer.send({ topic: 'txn.events', messages: [{ key, value: JSON.stringify(fraude) }] });

        if (riesgo === 'ALTO') {
          const revertido = { type: 'Reversed', transactionId: key, timestamp: Date.now(), payload: { reason: 'FRAUDE' } };
          await producer.send({ topic: 'txn.events', messages: [{ key, value: JSON.stringify(revertido) }] });
        } else {
          const confirmado = { type: 'Committed', transactionId: key, timestamp: Date.now(), payload: { ledgerId: 'L-' + Math.floor(Math.random() * 1000) } };
          await producer.send({ topic: 'txn.events', messages: [{ key, value: JSON.stringify(confirmado) }] });
        }
      } catch (err) {
        console.error('Error en el Orquestador:', err);
        await producer.send({ topic: 'txn.dlq', messages: [{ key, value: message.value.toString() }] });
      }
    },
  });
}

start();

