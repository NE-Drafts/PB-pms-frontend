import ParkingSessionsTable from "../../components/ParkingSessionsTable"

const Dashboard = () => {
  return (
    <main className={`w-full h-full overflow-y-scroll flex flex-col px-[4%] py-[20px] gap-[20px]`}>
    <div className={`w-full items-center justify-between flex mt-[20px]`}>
        <h4 className={`text-[24px] font-[600] text-blue-900`}>Parking Sessions</h4>
        <button className={`bg-blue-500 px-[10px] py-[6px] rounded-[7px] text-[#fff] cursor-pointer text-[14px]`}>
            Create Parking Session
        </button>
    </div>

    <ParkingSessionsTable />
    </main>
  )
}

export default Dashboard