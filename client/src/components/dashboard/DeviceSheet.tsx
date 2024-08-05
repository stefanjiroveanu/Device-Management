import { ReactComponent as DeviceSvg } from "../../device.svg";
import { useNavigate } from "react-router-dom";
import { Device } from "./DeviceDashboard";

interface DeviceSheetProps {
  devices: Device[];
}

const DeviceSheet = ({ devices }: DeviceSheetProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex-box gap-40 grid grid-cols-4">
      {devices.map((device: Device) => (
        <div
          key={device.uuid}
          className="text-white opacity-50 font-display font-thin w-20 h-40 text-center hover:opacity-100 pr-10"
          onClick={() => {
            navigate(`/dashboard/devices/${device.uuid}`, { replace: true });
          }}
        >
          <DeviceSvg className="w-40 h-40" />
          <div className="w-40">
          {device.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeviceSheet;
