import DevicesManagementDataSource from "../db";
import { Device } from "../entity/Device";

export const saveDevice = async (payload: any) => {
  const manager = (await DevicesManagementDataSource).manager;
  const { deviceUuid, userUuid, maxEnergyConsumption } = payload;
  const device = manager.create(Device, {
    deviceUuid: deviceUuid,
    userUuid: userUuid,
    maxEnergyConsumption: maxEnergyConsumption,
  });
  try {
    await manager.save(device);
  } catch (err) {
    console.log(err);
  }
};

export const updateDevice = async (payload: any) => {
  const manager = (await DevicesManagementDataSource).manager;
  const { deviceUuid, userUuid, maxEnergyConsumption } = payload;
  try {
    const device = findDevice(deviceUuid);
    if (!device) {
      saveDevice(payload);
    }
    await manager.update(
      Device,
      { deviceUuid: deviceUuid },
      {
        deviceUuid: deviceUuid,
        userUuid: userUuid,
        maxEnergyConsumption: maxEnergyConsumption,
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const deleteDevice = async (deviceUuid: string) => {
  const manager = (await DevicesManagementDataSource).manager;
  try {
    await manager.delete(Device, { deviceUuid: deviceUuid });
  } catch (err) {
    console.log(err);
  }
};

export const findDevice = async (deviceUuid: string) => {
  const manager = (await DevicesManagementDataSource).manager;
  try {
    const found = await manager.findOne(Device, { where: { deviceUuid } });
    return found;
  } catch (err) {
    console.log(err);
  }
};

export const findDevicesUuidForUserWithUuid = async (userUuid: string) => {
  const manager = (await DevicesManagementDataSource).manager;
  try {
    const found = await manager.find(Device, { where: { userUuid } });
    const uuids = found.map((item) => item.deviceUuid);
    return uuids;
  } catch (err) {
    console.log(err);
  }
};
