import { useDisclosure } from "@mantine/hooks";
import SlotsTable from "../../components/SlotsTable";
import { Modal } from "@mantine/core";
import CreateSlotForm from "../../components/CreateSlotForm";

const Slots = () => {
  const [isCreateSlot, createSlotFns] = useDisclosure(false);

  return (
    <main
      className={`w-full h-full overflow-y-scroll flex flex-col px-[2%] py-[20px] gap-[20px]`}
    >
      <div className={`w-full items-center justify-between flex mt-[20px]`}>
        <h4 className={`text-[24px] font-[600] text-blue-900`}>
        Parking Slots
        </h4>
        <button
          className={`bg-blue-500 px-[10px] py-[6px] rounded-[7px] text-[#fff] cursor-pointer text-[14px]`}
          onClick={() => createSlotFns.open()}
        >
          Register Parking Slot
        </button>
      </div>

      <SlotsTable />

      <Modal opened={isCreateSlot} title="Register a parking slot" onClose={createSlotFns.close} centered>
        <CreateSlotForm />
      </Modal>
    </main>
  );
};

export default Slots;
