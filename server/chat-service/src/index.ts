import express, { Express, Request } from "express";
import { WebSocket, WebSocketServer } from "ws";
import http from "http";
import cors from "cors";
import axios from "axios";
import { createClient } from "redis";
import { router } from "./routes/connection.router";

const app: Express = express();
const PORT = 8084;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const server = http.createServer(app);

export const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  console.log(error);
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/connections", router);

interface Connection {
  adminSocket: WebSocket | null;
  userSocket: WebSocket | null;
}

interface Client {
  ws: WebSocket;
  role: string;
  uuid: string;
  name: string;
  pairedClientUuid?: string; // UUID of the paired user or admin
  pairedAdminsUuid?: string[];
}

export const wsClients: { [uuid: string]: Client } = {};

const wss: WebSocketServer = new WebSocketServer({ port: 8085 });

export const connections: { [key: string]: Connection } = {};

wss.on("connection", async (ws: WebSocket, req: Request) => {
  console.log("WebSocket connected");

  ws.on("message", (message: string) => {
    message = message.toString();
    const uuid = Object.values(wsClients)
      .filter((client) => client.ws === ws)
      .at(0)?.uuid;
    if (uuid) {
      const client = wsClients[uuid];
      if (client.pairedClientUuid) {
        const pairedClient = wsClients[client.pairedClientUuid];
        const pairedAdminsUuid = client.pairedAdminsUuid;
        let pairedAdminsWs:any[] = [];
        pairedAdminsUuid?.forEach((uuid) => {
          if (wsClients[uuid]) {
            pairedAdminsWs.push(wsClients[uuid].ws)
          }
        })
        console.log(pairedAdminsWs)
        if (pairedClient) {
          if (message === JSON.stringify({ type: "TYPING" })) {
            pairedClient.ws.send(
              JSON.stringify({
                type: "TYPING",
                payload: {
                  uuid: uuid,
                },
              })
            );
          } else if (message === JSON.stringify({ type: "SEEN" })) {
            pairedClient.ws.send(
              JSON.stringify({
                type: "SEEN",
                payload: {
                  uuid: uuid,
                },
              })
            );
          } else {
            pairedClient.ws.send(
              JSON.stringify({
                type: "MESSAGE",
                payload: {
                  uuid: uuid,
                  message: message,
                },
              })
            );
            console.log(pairedAdminsUuid);
            pairedAdminsWs.forEach((ws) => {
              if (pairedClient.ws != ws) {
                ws.send(
                  JSON.stringify({
                    type: "MESSAGE",
                    payload: {
                      uuid: uuid,
                      message: message,
                    },
                  })
                );
              }
            });
          }
        }
      }
    }
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
  });
  if (req.url) {
    const uuid = req.url.split("/")[1].split("?")[0];
    const token = req.url.split("token=")[1];
    try {
      const res = await axios.get("http://172.16.230.6:8080/auth/role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const role = res.data.role;
      const name = res.data.username;
      wsClients[uuid] = {
        ws: ws,
        role: role,
        uuid: uuid,
        name: name,
      };
      if (role === "USER") {
        connections[uuid] = {
          adminSocket: null,
          userSocket: ws,
        };
        Array.from(Object.values(wsClients)).forEach((client) => {
          if (client.role === "ADMIN") {
            client.ws.send(
              JSON.stringify({
                type: "NEW_USER",
                payload: {
                  uuid: uuid,
                  name: name,
                },
              })
            );
          }
        });
      }
    } catch (error) {
      console.log("asd");
    }
  }
});
