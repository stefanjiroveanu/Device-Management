import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { ReactComponent as Trash } from "../../trash.svg";
import { ReactComponent as CancelButton } from "../../cancel.svg";
import { ReactComponent as DeviceSvg } from "../../device.svg";
import { ReactComponent as DeleteRelation } from "../../delete_relation.svg";
import UserDeletePopup from "../modal/UserDeletePopup";
import { toast } from "react-toastify";

interface User {
  uuid: string;
  username: string;
  password: string;
  email: string;
  role: any;
  devices: [];
}

const UserPage = () => {
  const { uuid } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User>();
  const [username, setUsername] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [role, setRole] = useState<string>();
  const [openPopup, setOpenPopup] = useState(false);
  const [hasBeenEdited, setHasBeenEdited] = useState(false);
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const findUser = async () => {
      try {
        const currentUser: User = (
          await axios.get(`http://localhost:8080/users/${uuid}`)
        ).data;
        setUser(currentUser);
        setDevices(currentUser?.devices);
      } catch (error) {
        console.log("There was an error at the fetching of the users");
      }
    };
    findUser();
  }, [hasBeenEdited]);

  const handleIsEditing = () => {
    setUsername(user?.username);
    setEmail(user?.email);
    setRole(user?.role);
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/users/${uuid}`, {
        username: username,
        password: password,
        email: email,
        role: role,
      });
      handleSuccess();
    } catch (error: any) {
      if (error.response) {
        handleError(error.response.data);
      }
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
    toast.success("User has been edited", {
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

  const handleDeleteRelation = async (uuid: string) => {
    const newDevices =
      devices.filter((device: any) => device.uuid !== uuid) ?? [];
    setDevices(newDevices);
    await axios.put(`http://localhost:8081/devices/${uuid}`, {
      ownerId: -1,
    });
  };

  return (
    <div className="flex flex-col text-xl gap-20 mt-16">
      <UserDeletePopup
        isOpen={openPopup}
        uuid={user?.uuid}
        onRequestClose={() => {
          setOpenPopup(false);
        }}
      />
      <div className="flex flex-col text-white font-display font-thin">
        <div className="font-bold text-3xl flex flex-row gap-40">
          User Information
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
        <div className="mb-5">{user?.uuid}</div>
        {!isEditing && <div>Username: {user?.username}</div>}
        {isEditing && (
          <Input
            item={username}
            type="text"
            itemFunction={(e: any) => setUsername(e.target.value)}
            text="username"
          />
        )}
        {!isEditing && <div>Email: {user?.email}</div>}
        {isEditing && (
          <Input
            item={email}
            type="text"
            itemFunction={(e: any) => setEmail(e.target.value)}
            text="email"
          />
        )}
        {isEditing && (
          <Input
            item={password}
            type="password"
            itemFunction={(e: any) => setPassword(e.target.value)}
            text="password"
          />
        )}
        {!isEditing && <div>Role: {user?.role}</div>}
        {isEditing && (
          <div className="form-group">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mb-10"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}
        <div className="flex flex-row gap-16">
          {!isEditing && (
            <Button
              text="Edit user"
              itemFunction={() => {
                setIsEditing(!isEditing);
                handleIsEditing();
              }}
            ></Button>
          )}
          {isEditing && (
            <Button
              text="Sumbit User"
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
              <div className="absolute transition-all duration-1000 opacity-30 -inset-px bg-gradient-to-r from-red-400 via-red-800 to-red-400 rounded-xl blur-lg group-hover:opacity-70 group-hover:-inset-1 group-hover:duration-200 animate-tilt w-12"></div>
              <Trash className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col font-display text-white text-sm font-light gap-4">
        <div className="text-white font-display font-bold text-3xl flex flex-col">
          Devices
        </div>
        {devices.map((device: any) => {
          return (
            <div className="flex flex-row items-center">
              <div
                key={device.uuid}
                className="flex flex-row text-center items-center opacity-70 hover:opacity-100"
                onClick={() =>
                  navigate(`/dashboard/devices/${device.uuid}`, {
                    replace: true,
                  })
                }
              >
                <DeviceSvg className="w-10 h-10 mr-4" />
                {device.name}
              </div>
              <div
                className="relative inline-flex  group focus:outline-none ml-20"
                onClick={() => {
                  handleDeleteRelation(device.uuid);
                }}
              >
                <div className="absolute transition-all duration-1000 opacity-30 -inset-px bg-gradient-to-r from-red-400 via-red-800 to-red-400 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt w-6 ml-28"></div>
                <DeleteRelation className="w-6 h-6 ml-28" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserPage;
