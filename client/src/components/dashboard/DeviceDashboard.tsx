import axios from "axios";
import { useEffect, useState } from "react";
import { useNavbar } from "../../context/navbar/NavbarProvider";
import DeviceSheet from "./DeviceSheet";
import DeviceInputModal from "../modal/DeviceInputModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export interface Device {
  uuid: string;
  name: string;
  address: string;
  descriptiom: string;
  maxConsumption: string;
  userId: string;
}

const DeviceDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [filter, setFilter] = useState("");
  const { isOpen, setOpen } = useNavbar();
  const [refresh , setRefresh] = useState(false);


  useEffect(() => {
    const getDevices = async () => {
      try {
        const res = await axios.get("http://localhost:8081/devices");
        setDevices(res.data);
        setFilteredDevices(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (isOpen) setOpen(false);
    getDevices();
  }, [refresh]);

  const handleFilter = (e: any) => {
    e.preventDefault();
    setFilter(e.target.value);
    const filteredDevices = devices.filter((device: Device) =>
      device.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDevices(filteredDevices);
  };

  const handleError = (error: any) => {
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const handleSuccess = () => {
    toast.success("Device has been created", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    setRefresh(!refresh);
  };

  return (
    <>
      <div className="relative top-20">
        <input
          className="mb-20 rounded-xl bg-inherit border-2 border-solid border-slate-800 w-full h-8 text-white pl-2 text-sm outline-none font-display font-normal "
          type="text"
          placeholder=" "
          value={filter}
          onChange={handleFilter}
        />
        <label
          className={`absolute top-1 font-display left-2 transition-all pointer-events-none ${
            filter
              ? "-translate-y-6 text-sm text-white"
              : "text-base text-slate-500 font-display"
          }`}
        >
          Filter
        </label>
      </div>
      <div className="flex flex-row gap-88">
        <div className="flex flex-col">
          <DeviceSheet devices={filter ? filteredDevices : devices} />
        </div>
      </div>
      <DeviceInputModal
        isOpen={isOpen}
        onModalError={handleError}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default DeviceDashboard;
