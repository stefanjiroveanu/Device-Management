import express, { Express } from "express";
import cors from "cors";
import deviceRouter from "./routes/device.routes";
import { errorHandlerMiddleware } from "./middleware/error.checker";
import { connectQueue } from "./queue/queue";

const app: Express = express();

app.listen(8081, () => {
  console.log("The server has started on port 8081");
});

app.use(cors());
app.use(express.json());

app.use(errorHandlerMiddleware);
app.use("/devices", deviceRouter);
connectQueue();
