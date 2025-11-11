
const express = require('express');
const bodyParser = require('body-parser');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

// Configuración de Kafka
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();


async function start() {
  try {
    await producer.connect();
    console.log('Conectado al broker de Kafka correctamente.');

    const app = express();
    app.use(bodyParser.json());
    app.use(cors());


    // Ruta para una nueva transacción
    app.post('/transactions', async (req, res) => {
      try {
        const transactionId = uuidv4();

        const payload = {
          type: 'TransactionInitiated',
          transactionId,
          timestamp: Date.now(),
          payload: req.body,
        };

        
        // Enviar comando a Kafka
        await producer.send({
          topic: 'txn.commands',
          messages: [{ key: transactionId, value: JSON.stringify(payload) }],
        });

        console.log(`Transacción iniciada y enviada a Kafka: ${transactionId}`);
        res.json({ ok: true, transactionId });
      } catch (err) {
        console.error('Error al procesar la transacción:', err);
        res.status(500).json({
          ok: false,
          mensaje: 'Error interno al procesar la transacción.',
          detalle: err.message,
        });
      }
    });

    
    const port = 3001;
    app.listen(port, () => {
      console.log(`API ejecutándose correctamente en el puerto ${port}`);
      console.log('Esperando solicitudes POST en /transactions');
    });
  } catch (err) {
    console.error('No se pudo iniciar la API:', err);
  }
}

start();

