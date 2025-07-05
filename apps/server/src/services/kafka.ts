import { Kafka, Producer, KafkaConfig } from 'kafkajs';
import prisma from './prisma';
import config from '../config';

const kafkaConfig: KafkaConfig = {
    brokers: config.kafka.brokers,
};

// Add SSL and SASL configuration for production
if (config.kafka.ssl) {
    kafkaConfig.ssl = config.kafka.ssl;
}

if (config.kafka.sasl) {
    kafkaConfig.sasl = config.kafka.sasl;
}

const kafka = new Kafka(kafkaConfig);

let producer: Producer | null = null;

export async function createProducer(): Promise<Producer> {
    if (producer) return producer;
    
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export async function produceMessage(message: string, topic: string = 'MESSAGES'): Promise<void> {
    const prod = await createProducer();
    await prod.send({
        topic,
        messages: [{
            key: `message-${Date.now()}`,
            value: message
        }]
    });
}

export async function disconnectProducer(): Promise<void> {
    if (producer) {
        await producer.disconnect();
        producer = null;
    }
}
export async function startConsumer(){
    console.log('Starting Kafka consumer...');
    const consumer = kafka.consumer({ groupId: 'message-group' });
    await consumer.connect();
    await consumer.subscribe({ topic: 'MESSAGES', fromBeginning: true });

    await consumer.run({
        autoCommit: true,
        eachMessage: async ({ message, pause }) => {
            try {
                console.log(`Received message: ${message.value?.toString()}`);
                await prisma.message.create({
                    data: {
                        text: message.value?.toString()
                    }
                });
            } catch (error) {
                console.log('Something went wrong:', error);
                pause();
                setTimeout(() => {
                    consumer.resume([{ topic: 'MESSAGES' }]);
                }, 60 * 1000);
            }
        },
    });

    return consumer;
}
export default kafka;