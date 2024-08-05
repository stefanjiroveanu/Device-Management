import { ReactComponent as Sphere } from "../purple_sphere.svg";
import { ReactComponent as BlackSphere } from "../black_sphere.svg";
import LoginBox from "../components/login/LoginBox";

const LoginPage = () => {
  return (
    <div>
      <div className="ml-96">  
        <Sphere className="absolute top-0" />
      </div>
      <BlackSphere />
      <LoginBox />
    </div>
  );
};

export default LoginPage;
