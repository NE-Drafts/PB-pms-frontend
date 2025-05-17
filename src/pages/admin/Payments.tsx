import PaymentsTable from "../../components/PaymentsTable";


const Payments = () => {
  return (
    <main
      className={`w-full h-full overflow-y-scroll flex flex-col px-[2%] py-[20px] gap-[20px]`}
    >
      <div className={`w-full items-center justify-between flex mt-[20px]`}>
        <h4 className={`text-[24px] font-[600] text-blue-900`}>Payments</h4>
      </div>

      <PaymentsTable />
    </main>
  );
};

export default Payments;
