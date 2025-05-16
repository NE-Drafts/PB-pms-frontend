import { useState, useEffect } from "react";
import {
  DataTable,
  type DataTableColumn,
  type DataTableSortStatus,
} from "mantine-datatable";
import {
  Badge,
  Button,
  Group,
  Paper,
  Text,
  Tooltip,
  Modal,
  TextInput,
  Select,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconEye,
  IconEdit,
} from "@tabler/icons-react";

// Define TypeScript types based on your Prisma models
type ParkingSessionStatus = "ACTIVE" | "COMPLETED";
type PaymentStatus = "PENDING" | "COMPLETED";
type VehicleType = "CAR" | "TRUCK" | "MOTORCYCLE" | "BUS";

interface Payment {
  id: string;
  amount: number | null;
  status: PaymentStatus;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  vehicleType: VehicleType;
}

interface ParkingSlot {
  id: string;
  slotNumber: string;
}

interface ParkingSession {
  id: string;
  vehicleId: string;
  slotId: string;
  entryTime: Date;
  exitTime: Date | null;
  status: ParkingSessionStatus;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  slot: ParkingSlot;
  Payment: Payment | null;
}

const ParkingSessionsTable = () => {
  // State variables
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ParkingSession>>({
    columnAccessor: "entryTime",
    direction: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParkingSessionStatus | "">(
    ""
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ParkingSession | null>(
    null
  );

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API call
        // const response = await fetch('/api/v1/parking-sessions');
        // const data = await response.json();

        // Mock data for demonstration
        const mockData: ParkingSession[] = [
          {
            id: "1",
            vehicleId: "v1",
            slotId: "s1",
            entryTime: new Date("2025-05-15T08:30:00"),
            exitTime: null,
            status: "ACTIVE",
            createdAt: new Date("2025-05-15T08:30:00"),
            updatedAt: new Date("2025-05-15T08:30:00"),
            vehicle: {
              id: "v1",
              plateNumber: "RAD123",
              model: "Toyota Camry",
              vehicleType: "CAR",
            },
            slot: {
              id: "s1",
              slotNumber: "A-12",
            },
            Payment: null,
          },
          {
            id: "2",
            vehicleId: "v2",
            slotId: "s2",
            entryTime: new Date("2025-05-14T10:15:00"),
            exitTime: new Date("2025-05-14T14:30:00"),
            status: "COMPLETED",
            createdAt: new Date("2025-05-14T10:15:00"),
            updatedAt: new Date("2025-05-14T14:30:00"),
            vehicle: {
              id: "v2",
              plateNumber: "KGL789",
              model: "Honda Civic",
              vehicleType: "CAR",
            },
            slot: {
              id: "s2",
              slotNumber: "B-05",
            },
            Payment: {
              id: "p1",
              amount: 2500,
              status: "COMPLETED",
            },
          },
          {
            id: "3",
            vehicleId: "v3",
            slotId: "s3",
            entryTime: new Date("2025-05-16T09:45:00"),
            exitTime: null,
            status: "ACTIVE",
            createdAt: new Date("2025-05-16T09:45:00"),
            updatedAt: new Date("2025-05-16T09:45:00"),
            vehicle: {
              id: "v3",
              plateNumber: "RWA456",
              model: "Yamaha MT-07",
              vehicleType: "MOTORCYCLE",
            },
            slot: {
              id: "s3",
              slotNumber: "C-03",
            },
            Payment: null,
          },
        ];

        setSessions(mockData);
        setTotalRecords(mockData.length);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, [page, pageSize, sortStatus, searchQuery, statusFilter]);

  // Format date function
  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  // Format duration function
  const calculateDuration = (
    entryTime: Date,
    exitTime: Date | null
  ): string => {
    if (!exitTime) {
      const now = new Date();
      const diffInMs = now.getTime() - new Date(entryTime).getTime();
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m (ongoing)`;
    }

    const diffInMs =
      new Date(exitTime).getTime() - new Date(entryTime).getTime();
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Format amount function
  const formatAmount = (amount: number | null): string => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
    }).format(amount);
  };

  // Handler for viewing session details
  const handleViewSession = (session: ParkingSession) => {
    setSelectedSession(session);
    setViewModalOpen(true);
  };

  // Define columns for the DataTable
  const columns: DataTableColumn<ParkingSession>[] = [
    {
      accessor: "vehicle.plateNumber",
      title: "Vehicle",
      sortable: true,
      render: (session) => (
        <Tooltip
          label={`${session.vehicle.model} (${session.vehicle.vehicleType})`}
        >
          <div>
            <Text fw={500}>{session.vehicle.plateNumber}</Text>
            <Text size="xs" color="dimmed">
              {session.vehicle.model}
            </Text>
          </div>
        </Tooltip>
      ),
    },
    {
      accessor: "slot.slotNumber",
      title: "Slot",
      sortable: true,
      width: 100,
    },
    {
      accessor: "entryTime",
      title: "Entry Time",
      sortable: true,
      render: (session) => formatDate(session.entryTime),
    },
    {
      accessor: "exitTime",
      title: "Exit Time",
      sortable: true,
      render: (session) => formatDate(session.exitTime),
    },
    {
      accessor: "duration",
      title: "Duration",
      render: (session) =>
        calculateDuration(session.entryTime, session.exitTime),
    },
    {
      accessor: "status",
      title: "Status",
      sortable: true,
      render: (session) => (
        <Badge color={session.status === "ACTIVE" ? "green" : "blue"}>
          {session.status}
        </Badge>
      ),
    },
    {
      accessor: "paymentStatus",
      title: "Payment",
      render: (session) => {
        if (!session.Payment) {
          return <Badge color="red">NOT PAID</Badge>;
        }

        return (
          <Tooltip label={formatAmount(session.Payment.amount)}>
            <Badge
              color={
                session.Payment.status === "COMPLETED" ? "green" : "orange"
              }
            >
              {session.Payment.status}
            </Badge>
          </Tooltip>
        );
      },
    },
    {
      accessor: "actions",
      title: "Actions",
      width: 150,
      render: (session) => (
        <Group gap="xs" justify="flex-end">
          <Tooltip label="View Details">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => handleViewSession(session)}
            >
              <IconEye size={16} />
            </Button>
          </Tooltip>
          <Tooltip label="Edit">
            <Button variant="subtle" size="xs">
              <IconEdit size={16} />
            </Button>
          </Tooltip>
        </Group>
      ),
    },
  ];

  const handleRefresh = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPage(1);
  };

  

  return (
    <div className="w-full h-full flex flex-col">

      {/* Filters and search */}
      <Paper withBorder p="md" mb="md">
        <Group>
          <Group>
            <TextInput
              placeholder="Search by plate number..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              width={250}
            />
            <Select
              placeholder="Filter by status"
              clearable
              leftSection={<IconFilter size={16} />}
              data={[
                { value: "", label: "All Statuses" },
                { value: "ACTIVE", label: "Active" },
                { value: "COMPLETED", label: "Completed" },
              ]}
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as ParkingSessionStatus | "")
              }
              width={180}
            />
          </Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Group>
      </Paper>

      {/* DataTable */}
      <DataTable
      className={`w-full`}
        borderRadius="sm"
        shadow="sm"
        withTableBorder
        columns={columns}
        records={sessions}
        fetching={loading}
        highlightOnHover
        verticalSpacing="sm"
        noRecordsText="No parking sessions found"
        loadingText="Loading parking sessions..."
        page={page}
        recordsPerPage={pageSize}
        totalRecords={totalRecords}
        onPageChange={setPage}
        onRecordsPerPageChange={setPageSize}
        recordsPerPageOptions={[10, 25, 50, 100]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />

      {/* View Session Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Parking Session Details"
        size="lg"
      >
        {selectedSession && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text size="sm" color="dimmed">
                  Vehicle
                </Text>
                <Text fw={500}>
                  {selectedSession.vehicle.plateNumber} (
                  {selectedSession.vehicle.vehicleType})
                </Text>
                <Text size="sm">{selectedSession.vehicle.model}</Text>
              </div>
              <div>
                <Text size="sm" color="dimmed">
                  Parking Slot
                </Text>
                <Text fw={500}>{selectedSession.slot.slotNumber}</Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text size="sm" color="dimmed">
                  Entry Time
                </Text>
                <Text>{formatDate(selectedSession.entryTime)}</Text>
              </div>
              <div>
                <Text size="sm" color="dimmed">
                  Exit Time
                </Text>
                <Text>{formatDate(selectedSession.exitTime)}</Text>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text size="sm" color="dimmed">
                  Duration
                </Text>
                <Text>
                  {calculateDuration(
                    selectedSession.entryTime,
                    selectedSession.exitTime
                  )}
                </Text>
              </div>
              <div>
                <Text size="sm" color="dimmed">
                  Status
                </Text>
                <Badge
                  color={selectedSession.status === "ACTIVE" ? "green" : "blue"}
                >
                  {selectedSession.status}
                </Badge>
              </div>
            </div>

            <div>
              <Text size="sm" color="dimmed">
                Payment Information
              </Text>
              {selectedSession.Payment ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text size="sm" color="dimmed">
                      Amount
                    </Text>
                    <Text>{formatAmount(selectedSession.Payment.amount)}</Text>
                  </div>
                  <div>
                    <Text size="sm" color="dimmed">
                      Payment Status
                    </Text>
                    <Badge
                      color={
                        selectedSession.Payment.status === "COMPLETED"
                          ? "green"
                          : "orange"
                      }
                    >
                      {selectedSession.Payment.status}
                    </Badge>
                  </div>
                </div>
              ) : (
                <Badge color="red">NOT PAID</Badge>
              )}
            </div>

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              <Button color="blue">Edit</Button>
              {selectedSession.status === "ACTIVE" && (
                <Button color="green">End Session</Button>
              )}
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParkingSessionsTable;
