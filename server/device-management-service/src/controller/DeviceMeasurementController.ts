import { Raw } from "typeorm";
import DevicesManagementDataSource from "../db";
import { DeviceMeasurement } from "../entity/DeviceMeasurement";
import { Request, Response } from "express";
import { findDevicesUuidForUserWithUuid } from "./DeviceController";

export const saveMeasurement = async (payload: any) => {
  const manager = (await DevicesManagementDataSource).manager;
  const { deviceUuid, timestamp, measurementValue } = payload;
  const deviceMeasurement = manager.create(DeviceMeasurement, {
    deviceUuid: deviceUuid,
    timestamp: timestamp,
    measurementValue: measurementValue,
  });
  try {
    await manager.save(deviceMeasurement);
  } catch (err) {
    console.log(err);
  }
};

export const findMeasurement = async (req: Request, res: Response) => {
  const repository = (await DevicesManagementDataSource).getRepository(
    DeviceMeasurement
  );
  const timestamp: any = req.query["timestamp"];
  const uuid: any = req.query["user"];
  const startDate = new Date(timestamp);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(timestamp);
  endDate.setHours(23, 59, 59, 999);
  const items = await repository.findBy({
    timestamp: Raw((alias) => `${alias} > :startDate AND ${alias} < :endDate`, {
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
    }),
  });
  const devicesUuids = await findDevicesUuidForUserWithUuid(uuid);
  const newItems: { [key: string]: any[] } = {};
  items.forEach((item) => {
    if (devicesUuids && !devicesUuids.includes(item.deviceUuid)) {
        return;
    }
    if (!newItems[item.deviceUuid]) {
      newItems[item.deviceUuid] = [];
    }
    newItems[item.deviceUuid].push({
      timestamp: item.timestamp,
      measurementValue: item.measurementValue,
    });
  });
  res.status(200).send(newItems);
};
