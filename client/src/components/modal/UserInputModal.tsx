import React, { useState } from "react";
import Modal from "react-modal";
import Input from "../Input";
import Button from "../Button";
import axios from "axios";

Modal.setAppElement("#root");

const UserInputModal = ({ isOpen, onRequestClose, onModalError, onSuccess }: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:8080/users", {
        data: {
          username: username,
          email: email,
          password: password,
          role: role,
        },
      });
      if (res.status !== 200) {
        onModalError(`Error: ${res.data}`);
      }
      onSuccess();
    } catch (err:any) {
      console.log(err)
      onModalError(`Error: ${err.response.data.message}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen === true}
      onRequestClose={onRequestClose}
      contentLabel="User Input Modal"
      className="bg-[#17181E] opacity-[95%] bg-opacity-100 rounded-3xl fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-[9999] flex flex-col text-white font-display w-[47.5rem] h-max pb-20 items-center border-fuchsia-300 border-2"
      overlayClassName="asd"
    >
      <h2 className="text-center pb-10 pt-4">Enter User Details</h2>
      <form>
        <Input
          type="text"
          item={username}
          itemFunction={(e: any) => setUsername(e.target.value)}
          text="Username"
        />
        <Input
          email="email"
          item={email}
          itemFunction={(e: any) => setEmail(e.target.value)}
          text="Email"
        />
        <Input
          type="password"
          item={password}
          itemFunction={(e: any) => setPassword(e.target.value)}
          text="Password"
        />
        <div className="form-group">
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <Button itemFunction={handleSubmit} text="Sumbit User" />
      </form>
    </Modal>
  );
};

export default UserInputModal;
