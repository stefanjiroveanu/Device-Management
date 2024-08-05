import { connections, wsClients } from "../index";
import { Request, Response } from "express";
import { redisClient } from "../index";

export const getConnections = async (req: Request, res: Response) => {
    const clients = Object.values(wsClients);
    const connections = clients.map((client) => ({
        uuid: client.uuid,
        name: client.name,
        role: client.role,
    }));
    return res.status(200).send(connections);
};
 
export const asignAdminToConnection = async (req: Request, res: Response) => {
  const { userUuid } = req.params;
  const { adminUuid } = req.body;
  connections[userUuid] = {
    adminSocket: wsClients[adminUuid].ws, 
    userSocket: connections[userUuid].userSocket,
  };
  wsClients[adminUuid].pairedClientUuid = userUuid;
  wsClients[userUuid].pairedClientUuid = adminUuid;
  let pairedAdminsUuid = wsClients[userUuid].pairedAdminsUuid;
  if (pairedAdminsUuid) {
    if (!pairedAdminsUuid.includes(adminUuid)) {
      pairedAdminsUuid.push(adminUuid);
    }
  } else {
    pairedAdminsUuid = [adminUuid];
  }
  wsClients[userUuid].pairedAdminsUuid = pairedAdminsUuid;
  return res
    .status(200)
    .send({ message: "Admin socket assigned to connection." });
};

export const getConnection = async (req: Request, res: Response) => {};
