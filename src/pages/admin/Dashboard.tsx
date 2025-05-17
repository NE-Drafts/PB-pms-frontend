/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import ParkingSessionsTable from "../../components/ParkingSessionsTable";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import CreateParkingSessionForm from "../../components/CreateParkingSessionForm";

const Dashboard = () => {
  const { user } = useSelector((state: any) => state.userSlice);
  const [isCreateSession, createSessionFns] = useDisclosure(false);

  return (
    <main
      className={`w-full h-full overflow-y-scroll flex flex-col px-[2%] py-[20px] gap-[20px]`}
    >
      <p className={`text-[14px] font-[500] text-[#212121]`}>
        Welcome {user?.names}
      </p>
      <div className={`w-full items-center justify-between flex mt-[20px]`}>
        <h4 className={`text-[24px] font-[600] text-blue-900`}>
          Parking Sessions
        </h4>
        <button
          className={`bg-blue-500 px-[10px] py-[6px] rounded-[7px] text-[#fff] cursor-pointer text-[14px]`}
          onClick={() => createSessionFns.open()}
        >
          Create Parking Session
        </button>
      </div>

      <ParkingSessionsTable />

      <Modal
        opened={isCreateSession}
        onClose={createSessionFns.close}
        centered
        title="Create Parking Session"
      >
        <CreateParkingSessionForm />
      </Modal>
    </main>
  );
};

export default Dashboard;
