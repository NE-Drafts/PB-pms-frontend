import UserVehicles from "../../components/UserVehicles";

const Vehicles = () => {
  return (
    <div
      className={`w-full h-full overflow-y-scroll flex flex-col px-[2%] py-[20px] gap-[20px]`}
    >
      <div className={`w-full items-center justify-between flex mt-[20px]`}>
        <h4 className={`text-[24px] font-[600] text-blue-900`}>
          Your vehicles
        </h4>

        <button
          className={`bg-blue-500 px-[10px] py-[6px] rounded-[7px] text-[#fff] cursor-pointer text-[14px]`}
          onClick={() => {}}
        >
          Add new vehicle
        </button>
      </div>

      <UserVehicles />
    </div>
  );
};

export default Vehicles;
