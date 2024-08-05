import { useEffect, useState } from "react";
import { ReactComponent as DeviceSvg } from "../device.svg";
import { Popover } from "react-tiny-popover";
import { ReactComponent as WarningSvg } from "../warning-circle-svgrepo-com.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import {
  WebSocketProvider,
  useWs,
} from "../context/websocket/WebSocketProvider";
import Datepicker from "react-tailwindcss-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChatWidget from "../components/widget/ChatWidget";

interface User {
  uuid: string;
  username: string;
  password: string;
  email: string;
  role: any;
  devices: [];
}

const UserDashboard = () => {
  const { uuid, role, token } = useAuth();
  const [user, setUser] = useState<User>();
  const [devices, setDevices] = useState([]);
  const [devicesWithOverConsumption, setDevicesWithOverConsumption] = useState<
    any[]
  >([]);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [deviceUuidWithPopover, setDeviceUuidWithPopover] = useState("");

  const navigate = useNavigate();
  const { lastMessage }: any = useWs();
  const [startDate, setStartDate] = useState<any>(new Date());
  const [graphDates, setGraphDates] = useState<any[]>([]);

  const handleDateChange = async (timestamp: any) => {
    const response = await axios.get(
      `http://localhost:8082/measurement?timestamp=${timestamp}&user=${uuid}`
    );
    if (response.status === 200) {
      const payload = response.data;
      const uuids = Object.keys(payload);
      const values: any[] = Object.values(payload);
      for (let i = 0; i < values.length; i++) {
        for (let j = 0; j < values[i].length; j++) {
          values[i][j].timestamp = new Date(
            values[i][j].timestamp - 1
          ).getHours();
        }
      }
      console.log(values);
      if (uuids.length !== values.length) {
        throw new Error("Something bad happened on the request side");
      }
      setGraphDates([]);
      const names: { [key: string]: string } = {};
      for (let i = 0; i < uuids.length; i++) {
        const uuid = uuids[i];
        const response = await axios.get(
          "http://localhost:8081/devices/" + uuid
        );
        if (response.status === 200) {
          setGraphDates((graphData) => [
            ...graphData,
            {
              name: response.data.name,
              values: values[uuids.findIndex((id) => id === uuid)],
            },
          ]);
          console.log(graphDates);
        }
      }
    }
  };

  useEffect(() => {
    if (lastMessage) {
      const payload = JSON.parse(lastMessage.data);
      if (payload.message === "WARNING") {
        const currentDevices = [...devicesWithOverConsumption];
        currentDevices.push({
          deviceUuid: payload.deviceUuid,
          timestamp: payload.timestamp,
        });
        setDevicesWithOverConsumption(currentDevices);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const findUser = async () => {
      try {
        if (token) {
          const res = await axios.get(`http://localhost:8080/users/${uuid}`);
          const currentUser = res.data;
          setUser(currentUser);
          setDevices(currentUser?.devices);
        }
      } catch (error) {
        console.log("There was an error at the fetching of the users");
      }
    };
    findUser();
  }, [uuid, role, token]);

  return (
    <div className="flex flex-col text-xl gap-20 mt-96">
      {/* User Information Section */}
      <div className="flex flex-col text-white font-display font-thin">
        <div className="font-bold text-3xl flex flex-row gap-40">
          User Information
        </div>
        <div className="mb-5">{user?.uuid}</div>
        <div>Username: {user?.username}</div>
        <div>Email: {user?.email}</div>
        <div>Role: {user?.role}</div>
      </div>

      {/* Devices Section */}
      <div className="flex flex-col font-display text-white text-sm font-light gap-4">
        <div className="text-white font-display font-bold text-3xl flex flex-col">
          Devices
        </div>
        {devices.map((device: any) => {
          const isPopoverOpenForDevice =
            isPopoverOpen && deviceUuidWithPopover === device.uuid;

          return (
            <div className="flex flex-row items-center" key={device.uuid}>
              {/* Render device info */}
              <div
                className="flex flex-row text-center items-center opacity-70 hover:opacity-100"
                onClick={() =>
                  navigate(`/dashboard/devices/${device.uuid}`, {
                    replace: true,
                  })
                }
              >
                <DeviceSvg className="w-10 h-10 mr-4" />
                {device.name}
                {/* Render WarningSvg and Popover */}
                {devicesWithOverConsumption.some(
                  (e) => e.deviceUuid === device.uuid
                ) && (
                  <Popover
                    isOpen={isPopoverOpenForDevice}
                    content={
                      <div className="text-white font-display font-thin h-10 w-40 ml-80 text-xs pt-8">
                        This device has exceeded the maximum consumption at:
                        <div>
                          {devicesWithOverConsumption
                            .filter((e) => e.deviceUuid === device.uuid)
                            .map((filteredDevice, index) => (
                              <div key={index}>
                                {new Date(
                                  filteredDevice.timestamp
                                ).toISOString()}
                              </div>
                            ))}
                        </div>
                      </div>
                    }
                  >
                    <WarningSvg
                      className="w-8 h-8 ml-40"
                      onMouseEnter={() => {
                        setPopoverOpen(true);
                        setDeviceUuidWithPopover(device.uuid);
                      }}
                      onMouseLeave={() => {
                        setPopoverOpen(false);
                        setDeviceUuidWithPopover("");
                        const newDevices = devicesWithOverConsumption.filter(
                          (e) => e.deviceUuid !== device.uuid
                        );
                        setDevicesWithOverConsumption(newDevices);
                      }}
                    />
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
        <Datepicker
          asSingle={true}
          value={startDate}
          onChange={(e) => {
            handleDateChange(e?.startDate);
            setStartDate(e);
          }}
          showShortcuts={false}
          primaryColor={"fuchsia"}
          popoverDirection="up"
          displayFormat={"DD-MM-YYYY"}
        />
        <LineChart width={800} height={400} data={graphDates}>
          <XAxis dataKey="timestamp" tick={{ fontSize: 8 }} />
          <YAxis dataKey="measurementValue" />
          <Tooltip />
          <Legend />
          {graphDates.map((deviceData) => (
            <Line
              key={deviceData.name}
              type="monotone"
              dataKey="measurementValue"
              data={deviceData.values}
              name={deviceData.name}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
            />
          ))}
        </LineChart>
      </div>
      <WebSocketProvider url="ws://localhost:8085/">
        <ChatWidget />
      </WebSocketProvider>
    </div>
  );
};

export default UserDashboard;
