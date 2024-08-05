import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const UserDeletePopup = ({ isOpen, onRequestClose, uuid }: any) => {
  const navigate = useNavigate();
  const handleSubmit = async () => {
    await axios.delete(`http://localhost:8080/users/${uuid}`);
    navigate("/dashboard/users");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Input Modal"
      className="bg-[#17181E] opacity-[95%] bg-opacity-100 rounded-lg fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-[9999] flex flex-col text-white font-display w-[47.5rem] h-max pb-5 items-center"
      overlayClassName="asd"
    >
      <h2 className="text-center pb-20">
        Are you sure you want to delete this User
      </h2>
      <form className="flex flex-row justify-center gap-40">
        <div
          className="rounded-lg bg-red-400 w-12 h-6 text-center hover:bg-red-500"
          onClick={handleSubmit}
        >
          Yes
        </div>
        <div
          className="rounded-lg bg-green-400 w-12 h-6 text-center hover:bg-green-600"
          onClick={onRequestClose}
        >
          No
        </div>
      </form>
    </Modal>
  );
};

export default UserDeletePopup;
