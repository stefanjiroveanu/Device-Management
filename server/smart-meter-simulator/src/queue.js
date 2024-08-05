import amqp from "amqplib";

var channel, connection; //global variables
export const queueName = "measurement";

export async function connectQueue() {
  try {
    console.log("trying to connect \n\n\n");
    connection = await amqp.connect("amqp://localhost:5673");
    channel = await connection.createChannel();

    await channel.assertQueue(queueName);
    return { channel, connection };
  } catch (error) {
    console.log(error);
  }
}

export const sendToQueue = async (payload) => {
    console.log(payload);
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)));
}
