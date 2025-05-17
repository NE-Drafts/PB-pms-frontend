/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import UserParkingSessionsTable from "../../components/UserParkingSessionsTable";

const UserDashboard = () => {
  const { user } = useSelector((state: any) => state.userSlice);

  return (
    <main className={`w-full h-full overflow-y-scroll flex flex-col px-[2%] py-[20px] gap-[20px]`}>
      <p className={`text-[14px] font-[500] text-[#212121]`}>
        Welcome {user?.names}
      </p>

      <div className={`w-full items-center justify-between flex mt-[20px]`}>
        <h4 className={`text-[24px] font-[600] text-blue-900`}>
          Parking Sessions
        </h4>
      </div>

      <UserParkingSessionsTable />
    </main>
  );
};

export default UserDashboard;
