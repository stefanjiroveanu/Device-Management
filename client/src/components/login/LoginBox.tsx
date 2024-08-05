import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import InvalidLoginPopup from "../modal/InvalidLoginPopup";

const LoginBox = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setToken, uuid } = useAuth();

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: any) => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.status === 401) {
        setOpen(true);
      } else {
        const { token } = await response.json();
        setToken(token);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-10 text-white font-display text-center text-4xl non-italic font-bold leading-normal">
        Device Manager
      </h1>
      <InvalidLoginPopup open={open} setOpen={setOpen} />
      <div className="relative w-80 flex">
        <input
          className="mb-5 rounded-xl bg-inherit border-2 border-solid border-slate-800 w-full h-8 text-white pl-2 text-sm outline-none font-display font-normal"
          type="text"
          placeholder=" "
          value={username}
          onChange={handleUsernameChange}
        />
        <label
          className={`absolute top-1 font-display left-2 transition-all pointer-events-none ${
            username
              ? "-translate-y-6 text-sm text-white"
              : "text-base text-slate-500 font-display"
          }`}
        >
          Username
        </label>
      </div>
      <div className="relative w-80 flex">
        <input
          className="mb-20 rounded-xl bg-inherit border-2 border-solid border-slate-800 w-full h-8 text-white pl-2 text-sm outline-none font-display font-normal"
          type="password"
          placeholder=" "
          value={password}
          onChange={handlePasswordChange}
        />
        <label
          className={`absolute top-1 font-display left-2 transition-all pointer-events-none ${
            password
              ? "-translate-y-6 text-sm text-white"
              : "text-base text-slate-500 font-display"
          }`}
        >
          Password
        </label>
      </div>
      <div className="relative inline-flex  group focus:outline-none">
        <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-fuchsia-700 via-[#FF44EC] to-fuchsia-400 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
        <a
          href="#"
          className=" bg-gradient-to-br from-fuchsia-700 to-fuchsia-400 relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-display w-96 h-12 focus:border-0"
          role="button"
          onClick={handleLogin}
        >
          Sign in.
        </a>
      </div>
      <a
        href="#"
        className="mt-10 font-display text-white text-sm font-semibold"
      >
        Forgot you password?
      </a>
    </div>
  );
};

export default LoginBox;
