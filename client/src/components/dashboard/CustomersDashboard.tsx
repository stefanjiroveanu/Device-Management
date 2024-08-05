import axios from "axios";
import { useEffect, useState } from "react";
import UserSheet, { User } from "./UserSheet";
import { useNavbar } from "../../context/navbar/NavbarProvider";
import UserInputModal from "../modal/UserInputModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const { isOpen, setOpen } = useNavbar();
  const [refresh , setRefresh] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (isOpen) setOpen(false);
    getUsers();
  }, [refresh]);

  const handleFilter = (e: any) => {
    e.preventDefault();
    setFilter(e.target.value);
    const filteredUsers = users.filter((user: User) =>
      user.username.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filteredUsers);
  };

  const handleError = (error:any) => {
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
    toast.success('User has been created', {
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
  }

  return (
    <>
      <div className="relative top-20">
        <input
          className="mb-20 rounded-xl bg-inherit border-2 border-solid border-slate-800 w-full h-8 text-white pl-2 text-sm outline-none font-display font-normal"
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
      <div className="flex flex-row gap-96">
        <div className="flex flex-col">
          <UserSheet users={filter ? filteredUsers : users} />
        </div>
      </div>
      <UserInputModal isOpen={isOpen} onModalError={handleError} onSuccess={handleSuccess} />
    </>
  );
};

export default CustomersDashboard;
