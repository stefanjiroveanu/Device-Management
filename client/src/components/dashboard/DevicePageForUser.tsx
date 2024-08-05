import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useWs } from "../../context/websocket/WebSocketProvider";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";

interface Device {
  uuid: string;
  name: string;
  address: string;
  description: string;
  maxEnergyConsumption: number;
  userUuid: string;
}

const DevicePageForUsers = () => {
  const { uuid } = useParams();
  const [device, setDevice] = useState<Device>();
  const [currentOwner, setCurrentOwner] = useState<any>();
  const { lastMessage }: any = useWs();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (lastMessage) {
      const payload = JSON.parse(lastMessage.data);
      if (payload.deviceUuid === device?.uuid) {
        console.log(payload);
        setData((currentData) => [
          ...currentData,
          {
            timestamp: new Date(payload.timestamp).getMinutes().toString(),
            measurement: payload.measurement,
          },
        ]);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const findDevice = async () => {
      try {
        const currentDevice: Device = (
          await axios.get(`http://localhost:8081/devices/${uuid}`)
        ).data;
        setDevice(currentDevice);
        if (currentDevice.userUuid) {
          const currentOwner = (
            await axios.get(
              `http://localhost:8080/users/${currentDevice.userUuid}`
            )
          ).data;
          setCurrentOwner(currentOwner);
          currentDevice.userUuid = currentOwner.uuid;
          setDevice(currentDevice);
        }
      } catch (error) {
        console.log("There was an error at the fetching of the devices");
      }
    };
    findDevice();
  }, []);

  return (
    <div className="flex flex-row text-xl gap-20 mt-16">
      <div className="flex flex-col text-white font-display font-thin">
        <div className="font-bold text-3xl flex flex-row gap-40">
          Device Information
        </div>
        <div className="mb-5">{device?.uuid}</div>
        <div>Name: {device?.name}</div>
        <div>Address: {device?.address}</div>
        <div>Description: {device?.description}</div>
        <div>Max. Consumption: {device?.maxEnergyConsumption}</div>
        <div className="mb-10">Owner: {currentOwner?.username}</div>
        <LineChart width={500} height={300} data={data}>
          <XAxis dataKey="timestamp" tick={{ fontSize: 8 }}/>
          <YAxis dataKey="measurement" />
          <ReferenceLine y={device?.maxEnergyConsumption} stroke="#ffffff"/>
          <Line type="linear" dataKey="measurement" stroke="#8884d8"/>
        </LineChart>
      </div>
    </div>
  );
};

export default DevicePageForUsers;
