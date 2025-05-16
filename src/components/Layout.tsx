import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";

const Layout = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <section className={`w-full h-full flex items-start justify-start`}>
      <div className={`w-[25%] h-full bg-[#fff]`}>
        {isAdmin ? <AdminSidebar /> : <UserSidebar />}
      </div>

      <div className={`w-full h-full`}>
        <Outlet />
      </div>
    </section>
  );
};

export default Layout;
