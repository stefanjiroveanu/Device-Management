import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { ReactComponent as Trash } from "../../trash.svg";
import { ReactComponent as CancelButton } from "../../cancel.svg";
import UserDeletePopup from "../modal/UserDeletePopup";
import DeviceDeletePopup from "../modal/DeviceDeletePopup";
import { toast } from "react-toastify";

interface Device {
  uuid: string;
  name: string;
  address: string;
  description: string;
  maxEnergyConsumption: number;
  userUuid: string;
}

const DevicePage = () => {
  const { uuid } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [device, setDevice] = useState<Device>();
  const [name, setName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [maxConsumption, setMaxConsumption] = useState<number>();
  const [currentOwner, setCurrentOwner] = useState<any>();
  const [openPopup, setOpenPopup] = useState(false);
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const [owners, setOwners] = useState<any[]>();

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

    const findUsers = async () => {
      try {
        const users = (await axios.get("http://localhost:8080/users")).data;
        setOwners(users);
      } catch (error) {
        console.log("There was an error at the fetching of the Users");
      }
    };
    findUsers();
    findDevice();
  }, [hasBeenEdited]);

  const handleIsEditing = () => {
    setName(device?.name);
    setAddress(device?.address);
    setDescription(device?.description);
    setMaxConsumption(device?.maxEnergyConsumption);
    setCurrentOwner(currentOwner);
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:8081/devices/${uuid}`, {
        name: name,
        address: address,
        description: description,
        maxConsumption: maxConsumption,
        ownerId: currentOwner,
      });
      handleSuccess();
    } catch (error: any) {
      handleError(error.message);
    }
    setHasBeenEdited(!hasBeenEdited);
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
    toast.success("Device has been updated", {
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

  return (
    <div className="flex flex-row text-xl gap-20 mt-16">
      <DeviceDeletePopup
        isOpen={openPopup}
        uuid={device?.uuid}
        onRequestClose={() => {
          setOpenPopup(false);
        }}
      />
      <div className="flex flex-col text-white font-display font-thin">
        <div className="font-bold text-3xl flex flex-row gap-40">
          Device Information
          {isEditing && (
            <div
              className="relative inline-flex  group focus:outline-none"
              onClick={() => {
                setIsEditing(!isEditing);
              }}
            >
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-transparent via-[#e46e78] to-transparent rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <CancelButton className="w-6 h-6" />
            </div>
          )}
        </div>
        <div className="mb-5">{device?.uuid}</div>
        {!isEditing && <div>Name: {device?.name}</div>}
        {isEditing && (
          <Input
            item={name}
            type="text"
            itemFunction={(e: any) => setName(e.target.value)}
            text="Name"
          />
        )}
        {!isEditing && <div>Address: {device?.address}</div>}
        {isEditing && (
          <Input
            item={address}
            type="text"
            itemFunction={(e: any) => setAddress(e.target.value)}
            text="Address"
          />
        )}
        {!isEditing && <div>Description: {device?.description}</div>}
        {isEditing && (
          <Input
            item={description}
            type="text"
            itemFunction={(e: any) => setDescription(e.target.value)}
            text="Description"
          />
        )}
        {!isEditing && (
          <div>Max. Consumption: {device?.maxEnergyConsumption}</div>
        )}
        {isEditing && (
          <Input
            item={maxConsumption}
            type="text"
            itemFunction={(e: any) => setMaxConsumption(e.target.value)}
            text="Max Consumption"
          />
        )}
        {!isEditing && <div>Owner: {currentOwner?.username}</div>}
        {isEditing && (
          <div className="form-group">
            <select
              id="role"
              value={currentOwner?.uuid}
              onChange={(e) => {
                setCurrentOwner(e.target.value);
              }}
              className="mb-10"
            >
              {owners?.map((owner) => {
                return (
                  <option key={owner.uuid} value={owner.uuid}>
                    {owner.username}
                  </option>
                );
              })}
            </select>
          </div>
        )}
        <div className="flex flex-row gap-16">
          {!isEditing && (
            <Button
              text="Edit device"
              itemFunction={() => {
                setIsEditing(!isEditing);
                handleIsEditing();
              }}
            ></Button>
          )}
          {isEditing && (
            <Button
              text="Sumbit Device"
              itemFunction={() => {
                submitEdit();
                setIsEditing(!isEditing);
              }}
            ></Button>
          )}
          <div
            onClick={() => {
              setOpenPopup(true);
            }}
          >
            <div className="relative inline-flex  group focus:outline-none">
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-red-400 via-red-800 to-red-400 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt w-12"></div>
              <Trash className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicePage;
