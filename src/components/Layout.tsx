/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";
import { useSelector } from "react-redux";

const Layout = () => {
  const { user } = useSelector((state: any) => state.userSlice);
  const isAdmin = user.role === "ADMIN";

  return (
    <section className={`w-full h-full flex items-start justify-start`}>
      <div className={`w-[23%] h-full bg-[#fff]`}>
        {isAdmin ? <AdminSidebar /> : <UserSidebar />}
      </div>

      <div className={`w-full h-full`}>
        <Outlet />
      </div>
    </section>
  );
};

export default Layout;
