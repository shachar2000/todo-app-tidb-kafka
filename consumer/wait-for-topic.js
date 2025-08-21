// wait-for-topic.js
const { Kafka } = require('kafkajs');
const runConsumer = require('./consumer');

const kafka = new Kafka({ clientId: 'todo-consumer-waiter', brokers: ['kafka:9092'] });
const admin = kafka.admin();
const topic = 'test-topic';
const waitTime = 5000;

const waitForTopic = async () => {
  await admin.connect();
  console.log(`Checking if topic "${topic}" exists...`);

  while (true) {
    const topics = await admin.listTopics();
    if (topics.includes(topic)) {
      console.log(`Topic "${topic}" is ready!`);
      break;
    }
    console.log(`Topic "${topic}" not ready yet, waiting ${waitTime / 1000}s...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  await admin.disconnect();
  console.log('Starting consumer...');
  runConsumer();
};

waitForTopic().catch(console.error);
