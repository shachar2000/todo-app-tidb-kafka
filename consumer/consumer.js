// consumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'todo-consumer',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'todo-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const value = JSON.parse(message.value.toString());
  
        const logEntry = {
          timestamp: new Date().toISOString(),
          action: value.type,      // INSERT / UPDATE / DELETE
          table: value.table,
          data: value.data,
          oldData: value.old || null,
          topic: topic,
          partition: partition,
          offset: message.offset
        };
  
        console.log(JSON.stringify(logEntry));
      } catch (err) {
        console.error('Error parsing message:', message.value.toString());
      }
    },
  });  
};

module.exports = runConsumer;
