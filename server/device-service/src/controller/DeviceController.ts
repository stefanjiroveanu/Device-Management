import { Response, Request } from "express";
import DevicesDataSource from "../db";
import { Device } from "../entity/Device";
import { randomUUID } from "crypto";
import { sendToQueue } from "../queue/queue";
import { QueuePayload } from "../queue/QueuePayload";

export const saveDevice = async (req: Request, res: Response) => {
  const manager = (await DevicesDataSource).manager;
  const { name, address, description, maxConsumption, ownerId } = req.body;

  if (!name || !address || !description || !maxConsumption ) {
    return res.status(400).send("Fields cannot be null");
  }

  if (maxConsumption < 0) {
    return res.status(400).send("Maximum consumption cannot be negative");
  }

  const uuid = randomUUID().toString();
  const device = manager.create(Device, {
    uuid: uuid,
    name: name,
    address: address,
    description: description,
    maxEnergyConsumption: maxConsumption,
    userUuid: ownerId,
  });
  try {
    await manager.save(device);
    const payload: QueuePayload = {
      device: {
        deviceUuid:uuid,
        maxEnergyConsumption:maxConsumption,
        userUuid: ownerId
      }, 
      operation: "SAVE" 
    }
    await sendToQueue(payload);
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
  return res.status(201).send(device);
};

export const findAllDevices = async (req: Request, res: Response) => {
  const manager = (await DevicesDataSource).manager;
  const userUuid = req.query.user?.toLocaleString();
  let devices = null;
  if (userUuid) {
    devices = await manager.find(Device, {
      where: { userUuid },
    });
  } else {
    devices = await manager.find(Device);
  }
  return res.status(200).send(devices);
};

export const findDeviceByUuid = async (req: Request, res: Response) => {
  const manager = (await DevicesDataSource).manager;
  const uuid = req.params["uuid"];
  const device = await manager.findOne(Device, {
    where: { uuid },
  });
  return res.status(200).send(device);
};

export const deleteDeviceByUuuid = async (req: Request, res: Response) => {
  const manager = (await DevicesDataSource).manager;
  const uuid = req.params["uuid"];
  const device = await manager.findOne(Device, {
    where: { uuid },
  });
  await manager.remove(Device, device);
  return res.status(200).send(device);
};

export const updateDeviceByUuid = async (req: Request, res: Response) => {
  const manager = (await DevicesDataSource).manager;
  console.log("started update");
  const uuid = req.params["uuid"];
  const { name, address, description, maxConsumption, ownerId } = req.body;
  let toUpdateDevice: Device = new Device();
  if (name) toUpdateDevice.name = name;
  if (address) toUpdateDevice.address = address;
  if (description) toUpdateDevice.description = description;
  if (maxConsumption) toUpdateDevice.maxEnergyConsumption = maxConsumption;
  if (ownerId) toUpdateDevice.userUuid = ownerId;
  console.log(toUpdateDevice);
  
  if (maxConsumption < 0) {
    return res.status(400).send("Maximum consumption cannot be negative");
  }

  try {
    console.log(toUpdateDevice)
    await manager.update(Device, { uuid: uuid }, toUpdateDevice);
    if (maxConsumption || ownerId) {
      const payload: QueuePayload = {
        device : {
          deviceUuid:uuid,
          maxEnergyConsumption:maxConsumption,
          userUuid: ownerId
        },
        operation: "UPDATE"
      }
      await sendToQueue(payload);
    }
    res.status(200).send("Device Updated");
  } catch (err) {
    res.status(500).send("There was an error updating the Device");
  }
};

export const removeDeviceRelations = async (req: Request, res: Response) => {
  const manager = (await DevicesDataSource).manager;
  const userUuid = req.params["user"];
  try {
    const devices = await manager.update(
      Device,
      { userUuid: userUuid },
      { userUuid: "-1" }
    );
    res.status(200).send("Devices Updated");
  } catch (error) {
    res.status(500).send("There was an error updating the users");
  }
};
