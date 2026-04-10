import amqp from "amqplib";
import { messageConsumeFromQueue } from "../lib/queue.subscriber";
import { messageConsumeFromPdfQueueAndCreateChunk, messageConsumeFromChunkEmbeddingQueue } from "../lib/pdf.subscriber";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;
export const SMS_QUEUE_NAME = "sms";
export const PDF_QUEUE_NAME = "pdfQueue";
export const CHUNK_EMBEDDING_QUEUE_NAME = "chunkEmbeddingQueue";

const connectRabbitMQ = async () => {
  if (!connection) {
    console.log(connection);
    connection = await amqp.connect("amqp://smit:admin@localhost:5672");
    console.log("Connection created");
  }
  if (!channel) {
    channel = await connection.createChannel();
    console.log("channel created");
  }
  return channel;
};

export const publishToQueue = async (queueName: string, message: string | Buffer) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
  console.log(`Message sent to queue ${queueName}: ${message}`);
};

export const consumeFromQueue = async (
  queueName: string,
  callback: (msg: string) => Promise<void>,
) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async (msg) => {
    if (msg) {
      const messageContent = msg.content.toString();
      try {
        console.log(
          `Message received from queue ${queueName}: ${messageContent}`,
        );
        await callback(messageContent);
        channel.ack(msg);
      } catch (error) {
        console.error(`Error processing queue ${queueName}:`, error);
        channel.nack(msg, false, true);
      }
    }
  });
};

export const consumeFromQueueAsBuffer = async (
  queueName: string,
  callback: (msg: Buffer) => Promise<void>,
) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, async (msg) => {
    if (msg) {
      try {
        await callback(msg.content);
        channel.ack(msg);
      } catch (error) {
        console.error(`Error processing queue ${queueName}:`, error);
        channel.nack(msg, false, true);
      }
    }
  });
};

// subscribe to queues and publish messages

connectRabbitMQ().then(() => {

  consumeFromQueue(SMS_QUEUE_NAME, async (msg) => {
    await messageConsumeFromQueue(msg);
  });
  consumeFromQueueAsBuffer(PDF_QUEUE_NAME, async (msg) => {
    await messageConsumeFromPdfQueueAndCreateChunk(msg);
  });
  consumeFromQueue(CHUNK_EMBEDDING_QUEUE_NAME, async (msg) => {
    await messageConsumeFromChunkEmbeddingQueue(msg);
  });

});

