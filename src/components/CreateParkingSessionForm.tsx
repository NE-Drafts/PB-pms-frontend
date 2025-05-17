import { useEffect, useState } from "react";
import type { Vehicle } from "../types";
import { Select } from "@mantine/core";
import { getAllVehicles } from "../services/vehicle";
import { createParkingSession } from "../services/parkingSession";
import { ClipLoader } from "react-spinners";

const CreateParkingSessionForm = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<string>("");

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getAllVehicles({ setLoading: setIsLoading });
      setVehicles(data);
    };

    fetchVehicles();
  }, []);

  const createSession = async () => {
    await createParkingSession({ plateNumber: selectedPlate, setIsLoading });
  };

  return (
    <div className={`w-full py-[20px] px-[15px] flex flex-col gap-[20px]`}>
      <div className={`w-full`}>
        <Select
          onChange={(value) => setSelectedPlate(value ?? "")}
          data={vehicles.map((item) => item.plateNumber)}
          placeholder={
            isLoading
              ? "Wait! we are loading vehicles"
              : "Choose a plate number"
          }
        />
      </div>
      <button
        onClick={() => createSession()}
        disabled={Boolean(!selectedPlate)}
        className={`w-full bg-blue-500 py-[10px] px-[20px] rounded-[7px] flex justify-center items-center text-[#fff] text-[16px] font-[500]`}
      >
        {isLoading ? (
          <ClipLoader size={25} color="#fff" loading={isLoading} />
        ) : (
          "Create Session"
        )}
      </button>
    </div>
  );
};

export default CreateParkingSessionForm;
