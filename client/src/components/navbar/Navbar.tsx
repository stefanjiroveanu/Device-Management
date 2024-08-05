import { Link } from "react-router-dom";
import { ReactComponent as AddButton } from "../../plus.svg";
import { ReactComponent as UserSvg } from "../../person.svg";
import { ReactComponent as DeviceSvg } from "../../device.svg";
import { ReactComponent as ChatSvg } from "../../admin-chat.svg";
import { useLocation } from "react-router-dom";
import { useNavbar } from "../../context/navbar/NavbarProvider";
import { useAuth } from "../../context/auth/AuthProvider";

const Navbar = () => {
  const location = useLocation();
  const { isOpen, setOpen } = useNavbar();
  const { setToken, role } = useAuth();

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <div className="fixed left-3 top-3  text-xl text-white font-display font-semibold flex flex-row justify-between gap-96">
      <Link to="/" className="font-display mr-96">
        Device Manager
      </Link>
      <div className="fixed right-40 flex flex-row gap-5 float-right">
        {role.toLocaleLowerCase() === "admin" && (
          <Link to="/chat-room">
            <ChatSvg className="w-10 h-7" />
          </Link>
        )}
        {role.toLocaleLowerCase() === "admin" && (
          <Link to="/dashboard/devices">
            <DeviceSvg className="w-8 h-8" />
          </Link>
        )}
        <Link
          to={
            role.toLocaleLowerCase() === "admin"
              ? "/dashboard/users"
              : "/dashboard"
          }
        >
          <UserSvg className="w-10 h-8" />
        </Link>
        <div
          className="font-display text-m"
          onClick={() => {
            setToken(null);
            localStorage.clear();
          }}
        >
          Log-out
        </div>
        {(location.pathname === "/dashboard/users" ||
          location.pathname === "/dashboard/devices") && (
          <div
            className="relative inline-flex  group focus:outline-none"
            onClick={handleClick}
          >
            <div className="absolute transition-all duration-1000 opacity-40 -inset-px bg-gradient-to-r from-fuchsia-400 via-fuchsia-800 to-fuchsia-400 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt w-12"></div>
            <AddButton
              className={`transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-display w-8 h-8 focus:border-0 transform ${
                isOpen ? "rotate-45" : ""
              }`}
            ></AddButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
