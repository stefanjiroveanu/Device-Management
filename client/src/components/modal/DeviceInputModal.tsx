import { useEffect, useState } from "react";
import Modal from "react-modal";
import Input from "../Input";
import Button from "../Button";
import axios from "axios";
import { User } from "../dashboard/UserSheet";

Modal.setAppElement("#root");

const DeviceInputModal = ({
  isOpen,
  onRequestClose,
  onModalError,
  onSuccess,
}: any) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [maxConsumption, setMaxConsumption] = useState();
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    const getUsers = async () => {
      const users = await axios.get("http://localhost:8080/users");
      setUsers(users.data);
    };
    getUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8081/devices", {
        name: name,
        address: address,
        maxConsumption: maxConsumption,
        description: description,
        ownerId: owner,
      });
      if (res.status !== 200) {
        onModalError(res.data.message);
      }
      onSuccess();
    } catch (error: any) {
      if (error.response != null) {
        onModalError(error.response.data);
      } else {
        onModalError("Unexpected error");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Input Modal"
      className="bg-[#17181E] opacity-[95%] bg-opacity-100 rounded-3xl fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-[9999] flex flex-col text-white font-display w-[47.5rem] h-max pb-20 items-center border-fuchsia-300 border-2"
      overlayClassName="overlay"
    >
      <h2 className="text-center pb-10 pt-4">Enter Device Details</h2>
      <form>
        <Input
          type="text"
          item={name}
          itemFunction={(e: any) => setName(e.target.value)}
          text="Name"
        />
        <Input
          email="text"
          item={address}
          itemFunction={(e: any) => setAddress(e.target.value)}
          text="Address"
        />
        <Input
          email="text"
          item={description}
          itemFunction={(e: any) => setDescription(e.target.value)}
          text="Description"
        />
        <Input
          type="text"
          item={maxConsumption}
          itemFunction={(e: any) => setMaxConsumption(e.target.value)}
          text="Maximum Consumption"
        />
        <div className="form-group">
          <select
            id="owner"
            value={owner}
            onChange={(e) => {
              console.log(e.target.value);
              setOwner(e.target.value);
            }}
          >
            {users?.map((user) => {
              return (
                <option key={user.uuid} value={user.uuid}>
                  {user.username}
                </option>
              );
            })}
          </select>
        </div>
        <Button itemFunction={handleSubmit} text="Sumbit Device" />
      </form>
    </Modal>
  );
};

export default DeviceInputModal;
