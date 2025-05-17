/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Vehicle } from "../types";
import { getUserVehicles } from "../services/vehicle";
import { HashLoader } from "react-spinners";

const UserVehicles = () => {
  const { user } = useSelector((state: any) => state.userSlice);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserVehicles({ setIsLoading, userId: user?.id });
      setVehicles(data);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`w-full flex flex-wrap gap-[15px] items-center justify-start`}
    >
      {isLoading ? (
        <HashLoader size={30} color="#83B2FD" loading={isLoading} />
      ) : (
        <>
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className={`w-[20%] h-[200px] flex flex-col rounded-[10px] bg-[#fff] drop-shadow-lg gap-[18px] px-[2%] py-[20px]`}
            >
              <p className={`text-[16px] font-[700] text-gray-500`}>
                {vehicle.vehicleType}
              </p>
              <p className={`text-[26px] font-[700] text-gray-500`}>
                {vehicle.plateNumber}
              </p>
              <p className={`text-[14px] font-[700] text-gray-500`}>
                {vehicle.model}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserVehicles;
