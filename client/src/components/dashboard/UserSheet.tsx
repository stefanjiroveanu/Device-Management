import { useState } from "react";
import { ReactComponent as Person } from "../../person.svg";
import { useNavigate } from "react-router-dom";

interface UserSheetProps {
  users: User[];
}

export interface User {
  uuid: string;
  username: string;
}

const UserSheet = ({ users }: UserSheetProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex-box gap-10 grid grid-cols-4">
      {users.map((user: User) => (
        <div
          key={user.uuid}
          className="text-white opacity-50 font-display font-thin w-40 h-40 text-center hover:opacity-100"
          onClick={() => {
            navigate(`/dashboard/users/${user.uuid}`, { replace: true });
          }}
        >
          <Person />
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default UserSheet;
