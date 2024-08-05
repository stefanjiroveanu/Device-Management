import { ReactComponent as BlackSphere } from "../black_sphere.svg";
import { ReactComponent as PurpleSphere } from "../purple_sphere.svg";

const Page404 = () => {
  return (
    <div>
      <PurpleSphere  className="absolute top-0 right-48"/>
      <BlackSphere className="absolute bottom-10 left-48"/>
      <div className="text-white font-display font-bold text-4xl justify-center z-10">
        404 - Page Not Found
      </div>
    </div>
  );
};

export default Page404;
