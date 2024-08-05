import amqp, { Channel, Connection } from "amqplib";

var channel: Channel, connection: Connection; //global variables
export const queueName = "device";

export async function connectQueue() {
  try {
    console.log("trying to connect \n\n\n");
    connection = await amqp.connect("amqp://172.16.230.9:5672");
    channel = await connection.createChannel();

    await channel.assertQueue(queueName);
    return { channel, connection };
  } catch (error) {
    console.log(error);
  }
}

export const sendToQueue = async (payload: any) => {
  console.log(payload);
  try {
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
  } catch (err) {
    console.log(err);
  }
};
