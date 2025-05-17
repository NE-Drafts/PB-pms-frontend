/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@tabler/icons-react";
import { exitParkingSession, getAll } from "../services/parkingSession";
import type {
  ParkingSession,
  Vehicle,
  ParkingSlot,
  Payment,
  ParkingSessionStatus,
} from "../types";
import { ClipLoader } from "react-spinners";

const ParkingSessionsTable = () => {
  // State variables
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ParkingSession[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [endSessionLoading, setEndSessionLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ParkingSession>
  >({
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

  // Fetch parking sessions data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAll({ setLoading });

        // Ensure dates are properly parsed as Date objects
        const parsedData = response.map((session: any) => ({
          ...session,
          entryTime: new Date(session.entryTime),
          exitTime: session.exitTime ? new Date(session.exitTime) : null,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        }));

        setSessions(parsedData);
        setDataFetched(true);
      } catch (err) {
        console.error("Error fetching parking sessions:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search whenever sessions, searchQuery, or statusFilter changes
  useEffect(() => {
    if (!dataFetched) return;

    // Filter sessions based on search query and status filter
    let filtered = [...sessions];

    if (searchQuery) {
      filtered = filtered.filter((session) =>
        session.vehicle?.plateNumber
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }

    // Apply sorting
    if (sortStatus) {
      const { columnAccessor, direction } = sortStatus;

      filtered.sort((a, b) => {
        let compareA, compareB;

        // Handle nested properties like "vehicle.plateNumber"
        if (columnAccessor.includes(".")) {
          const [parent, child] = columnAccessor.split(".");
          compareA =
            parent === "vehicle" && a.vehicle
              ? a.vehicle[child as keyof Vehicle]
              : parent === "slot" && a.slot
              ? a.slot[child as keyof ParkingSlot]
              : parent === "Payment" && a.Payment
              ? a.Payment[child as keyof Payment]
              : null;
          compareB =
            parent === "vehicle" && b.vehicle
              ? b.vehicle[child as keyof Vehicle]
              : parent === "slot" && b.slot
              ? b.slot[child as keyof ParkingSlot]
              : parent === "Payment" && b.Payment
              ? b.Payment[child as keyof Payment]
              : null;
        } else if (columnAccessor in a) {
          compareA = a[columnAccessor as keyof ParkingSession];
          compareB = b[columnAccessor as keyof ParkingSession];
        } else {
          return 0;
        }

        // Handle nulls
        if (compareA === null || compareA === undefined)
          return direction === "asc" ? -1 : 1;
        if (compareB === null || compareB === undefined)
          return direction === "asc" ? 1 : -1;

        // Compare dates
        if (compareA instanceof Date && compareB instanceof Date) {
          return direction === "asc"
            ? compareA.getTime() - compareB.getTime()
            : compareB.getTime() - compareA.getTime();
        }

        // Compare strings
        if (typeof compareA === "string" && typeof compareB === "string") {
          return direction === "asc"
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        }

        // Default comparison for numbers
        const numA = Number(compareA);
        const numB = Number(compareB);
        if (isNaN(numA) || isNaN(numB)) return 0;
        return direction === "asc" ? numA - numB : numB - numA;
      });
    }

    // Update state with filtered results
    setFilteredSessions(filtered);
    setTotalRecords(filtered.length);
    setLoading(false);
  }, [sessions, searchQuery, statusFilter, sortStatus, dataFetched]);

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
    if (!entryTime) return "N/A";

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

  // Handler for refreshing data
  const handleRefresh = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPage(1);
    setLoading(true);

    // Optionally re-fetch data from API
    const fetchData = async () => {
      try {
        const response = await getAll({ setLoading });
        const parsedData = response.map((session: any) => ({
          ...session,
          entryTime: new Date(session.entryTime),
          exitTime: session.exitTime ? new Date(session.exitTime) : null,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
        }));

        setSessions(parsedData);
      } catch (err) {
        console.error("Error refreshing parking sessions:", err);
        setLoading(false);
      }
    };

    fetchData();
  };

  const columns: DataTableColumn<ParkingSession>[] = [
    {
      accessor: "vehicle.plateNumber",
      title: "Vehicle",
      sortable: true,
      render: (session) => {
        if (!session?.vehicle) return <Text>N/A</Text>;
        return (
          <Tooltip
            label={`${session.vehicle.model || "Unknown"} (${
              session.vehicle.vehicleType || "Unknown"
            })`}
          >
            <div>
              <Text fw={500}>{session.vehicle.plateNumber || "Unknown"}</Text>
              <Text size="xs" color="dimmed">
                {session.vehicle.model || "Unknown"}
              </Text>
            </div>
          </Tooltip>
        );
      },
    },
    {
      accessor: "slot.slotNumber",
      title: "Slot",
      sortable: true,
      width: 100,
      render: (session) => session?.slot?.slotNumber || "N/A",
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
        </Group>
      ),
    },
  ];

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
        className="w-full"
        borderRadius="sm"
        shadow="sm"
        withTableBorder
        columns={columns}
        records={filteredSessions}
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
              {selectedSession.status === "ACTIVE" && (
                <Button
                  color="green"
                  disabled={endSessionLoading}
                  onClick={() =>
                    exitParkingSession({
                      setIsLoading: setEndSessionLoading,
                      plateNumber: selectedSession.vehicle.plateNumber,
                    })
                  }
                >
                  {endSessionLoading ? (
                    <ClipLoader
                      size={20}
                      color="#fff"
                      loading={endSessionLoading}
                    />
                  ) : (
                    "End Session"
                  )}
                </Button>
              )}
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParkingSessionsTable;
