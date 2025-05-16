import { useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const navItems = [
    { label: "Dashboard", pathMatch: "dashboard" },
    { label: "Slots", pathMatch: "slots" },
    { label: "Payments", pathMatch: "payments" },
    { label: "Logout", pathMatch: "logout" },
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
                ${isActive ? "bg-[#83B2FD] text-white" : "hover:bg-[#83B2FD] hover:text-white"}
              `}
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
