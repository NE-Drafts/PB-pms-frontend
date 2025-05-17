/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

const UserDashboard = () => {
  const { user } = useSelector((state: any) => state.userSlice);

  return (
    <main className={`w-full h-full flex flex-col`}>
      <p className={`text-[14px] font-[500] text-[#212121]`}>
        Welcome {user?.names}
      </p>
    </main>
  );
};

export default UserDashboard;
