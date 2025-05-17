import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/store";

const AdminSidebar = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      pathMatch: "dashboard",
      action: () => {
        navigate("/admin/dashboard");
      },
    },
    {
      label: "Slots",
      pathMatch: "slots",
      action: () => {
        navigate("/admin/slots");
      },
    },
    {
      label: "Payments",
      pathMatch: "payments",
      action: () => {
        navigate("/admin/payments");
      },
    },
    {
      label: "Logout",
      pathMatch: "logout",
      action: () => {
        dispatch(logout());
      },
    },
  ];

  return (
    <div className="px-[3%] py-[25px] flex flex-col gap-[12px]">
      <h3 className="text-center font-[800] text-[#000] text-[18px]">
        Vehicle PMS
      </h3>

      <ul className="w-full flex flex-col items-start gap-[15px] px-[4%] mt-[20px]">
        {navItems.map((item) => {
          const isActive = path.includes(item.pathMatch);

          return (
            <li
              key={item.label}
              className={`w-full p-[10px] text-[16px] font-[600] cursor-pointer rounded-[7px]
                transition-colors duration-300 ease-out
                ${
                  isActive
                    ? "bg-[#83B2FD] text-white"
                    : "hover:bg-[#83B2FD] hover:text-white"
                }
              `}
              onClick={item.action}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
