import amqp, { Channel, Connection, Message } from "amqplib";
import { saveMeasurement } from "../controller/DeviceMeasurementController";
import {
  deleteDevice,
  findDevice,
  saveDevice,
  updateDevice,
} from "../controller/DeviceController";
import { wsClients } from "..";

const measurementQueue = "measurement";
const devicesQueue = "device";

async function connectQueue(queueName: string) {
  var channel: Channel, connection: Connection;
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

export async function startListeningToSmartMeter() {
  const queueConnection = await connectQueue(measurementQueue);
  console.log("Started listening to Smart Meter values");
  const deviceUuidsMeasurement: { [key: string]: any[] } = {};
  if (queueConnection) {
    const { channel } = queueConnection;

    channel.consume(measurementQueue, async (data: Message | null) => {
      if (data) {
        const payload = `${Buffer.from(data.content)}`;
        const { deviceUuid, timestamp, measurementValue } = JSON.parse(payload);

        if (!deviceUuidsMeasurement[deviceUuid]) {
          deviceUuidsMeasurement[deviceUuid] = [];
        }
        
        deviceUuidsMeasurement[deviceUuid].push(measurementValue);

        if (deviceUuidsMeasurement[deviceUuid].length === 6) {
          const measurement =
            deviceUuidsMeasurement[deviceUuid][5] -
            deviceUuidsMeasurement[deviceUuid][0];

          await saveMeasurement({
            deviceUuid: deviceUuid,
            timestamp: timestamp,
            measurementValue: measurement,
          });

          const device = await findDevice(deviceUuid);
          console.log(device);
          if (device) {
            if (device.maxEnergyConsumption < measurement) {
              if (wsClients[device.userUuid]) {
                wsClients[device.userUuid].send(JSON.stringify({
                    deviceUuid : deviceUuid,
                    timestamp: timestamp, 
                    measurement: measurement,
                    message: "WARNING"
                }));
              }
            } else {
                if (wsClients[device.userUuid]) {
                    wsClients[device.userUuid].send(JSON.stringify({
                        deviceUuid : deviceUuid,
                        timestamp: timestamp,
                        measurement: measurement, 
                        message: "INFO"
                    }));
                }
            }
          }
          deviceUuidsMeasurement[deviceUuid] = [];
        }
        channel.ack(data);
      }
    });
  }
}

export async function startListeningToDevices() {
  const queueConnection = await connectQueue(devicesQueue);
  if (queueConnection) {
    const { channel } = queueConnection;

    channel.consume(devicesQueue, async (data: Message | null) => {
      if (data) {
        try {
          const payload = `${Buffer.from(data.content)}`;
          const { device, operation } = JSON.parse(payload);
          if (operation === "SAVE") {
            await saveDevice(device);
          } else if (operation === "UPDATE") {
            await updateDevice(device);
          } else if (operation === "DELETE") {
            await deleteDevice(device.deviceUuid);
          }
        } catch (err) {
          console.log(err);
        }
        channel.ack(data);
      }
    });
  }
}
