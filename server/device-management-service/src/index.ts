import express, { Express, Request } from "express";
import {
  startListeningToDevices,
  startListeningToSmartMeter,
} from "./queue/queue";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import { findMeasurement } from "./controller/DeviceMeasurementController";
import cors from "cors";
import authChecker from "./middleware/auth.checker";

const app: Express = express();
const PORT = 8082;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

const server = http.createServer(app);

app.use(express.json());
app.use(cors({
    origin: "*",
  }));
startListeningToSmartMeter();
startListeningToDevices();

app.get("/measurement", authChecker, findMeasurement)

const wss: WebSocketServer = new WebSocketServer({ port:8083 });
export const wsClients: { [key: string]: WebSocket } = {};

wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("WebSocket connected");
    
    // Handling incoming WebSocket connections
    ws.on('message', (message: string) => {
      console.log('Received message:', message);
      // Handle incoming messages from the connected clients here
    });
  
    ws.on('close', () => {
      console.log('WebSocket disconnected');
      // Handle WebSocket close event (optional)
    });
  
    // Storing connected clients, adjust as per your requirements
    if (req.url) {
      const baseUrl = req.url.split('/')[1];
      console.log(baseUrl);
      wsClients[baseUrl] = ws;
    }
  });

