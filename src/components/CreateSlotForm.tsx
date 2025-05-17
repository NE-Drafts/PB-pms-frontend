import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { createSlot } from "../services/slots";

const CreateSlotForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [slot, setSlot] = useState<string>("");

  const createSession = async () => {
    await createSlot({ slotNumber: slot, setIsLoading });
  };

  return (
    <div className={`w-full py-[20px] px-[15px] flex flex-col gap-[20px]`}>
      <div className={`w-full`}>
        <input
          type="text"
          placeholder="Write slot Identifier"
          value={slot}
          className={`w-full text-[14px] font-[500] text-[#000] px-[12px] py-[10px] rounded-[10px] border-[#00000066] border-solid border-[1px] outline-none`}
          onChange={(e) => setSlot(e.target.value)}
        />
      </div>
      <button
        onClick={() => createSession()}
        disabled={Boolean(!slot)}
        className={`w-full bg-blue-500 py-[10px] px-[20px] rounded-[7px] flex justify-center items-center text-[#fff] text-[16px] font-[500]`}
      >
        {isLoading ? (
          <ClipLoader size={25} color="#fff" loading={isLoading} />
        ) : (
          "Create Slot"
        )}
      </button>
    </div>
  );
};

export default CreateSlotForm;
