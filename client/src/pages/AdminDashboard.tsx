import { ReactComponent as UserSvg } from "../person.svg";
import { ReactComponent as DeviceSvg } from "../device.svg";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row gap-10">
      <div className="flex flex-col items-center opacity-70 hover:opacity-100"
       onClick={() => navigate("/dashboard/users", {replace:true})}>
        <UserSvg className="w-80 h-80" />
        <div className="text-3xl text-white font-display font-bold">Users</div>
      </div>
      <div
        className="flex flex-col items-center opacity-70 hover:opacity-100"
        onClick={() => navigate("/dashboard/devices", {replace:true})}
      >
        <DeviceSvg className="w-80 h-80" />
        <div className="text-3xl text-white font-display font-bold">
          Devices
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
