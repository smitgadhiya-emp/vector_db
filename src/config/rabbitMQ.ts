import amqp from "amqplib";
import { messageConsumeFromQueue } from "../lib/queue.subscriber";

let connection: amqp.ChannelModel | null = null;
let channel: amqp.Channel | null = null;

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

export const publishToQueue = async (queueName: string, message: string) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message));
  console.log(`Message sent to queue ${queueName}: ${message}`);
};

export const consumeFromQueue = async (
  queueName: string,
  callback: (msg: string) => void,
) => {
  const channel = await connectRabbitMQ();
  await channel.assertQueue(queueName, { durable: true });
  channel.consume(queueName, (msg) => {
    if (msg) {
      const messageContent = msg.content.toString();
      console.log(
        `Message received from queue ${queueName}: ${messageContent}`,
      );
      callback(messageContent);
      channel.ack(msg);
    }
  });
};

// subscribe to queues and publish messages

connectRabbitMQ().then(() => {
//   publishToQueue("sms", "Hello from RabbitMQ 1!").catch(console.error);


  consumeFromQueue("sms", (msg) => messageConsumeFromQueue(msg));
  consumeFromQueue("email", (msg) => {
    console.log("email", msg);
  });

});

