import config from "../device.json" with { type: "json" };
import LineByLineReader from "line-by-line";
import { connectQueue, sendToQueue } from "./queue.js";

const filePath =
  "/Users/stefanjiroveanu/Documents/DS2023_30643_Jiroveanu_Stefan_Assigment1/server/smart-meter-simulator/sensor.csv";

const lr = new LineByLineReader(filePath);

await connectQueue();

const readLineByLine = () => {
  lr.on("line", async (line) => {
    lr.pause();
    const payload = {
      timestamp: new Date().getTime(),
      deviceUuid: config.device_uuid,
      measurementValue: line,
    };
    await sendToQueue(payload);
    setTimeout(function () {
      lr.resume();
    }, 60 * 10);
  });

  lr.on("end", async () => {
    lr.close();
    await channel.close();
    await connection.close();
  });
};

readLineByLine();
