import { useState, useEffect } from "react";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import {
  IconCircleCheck,
  IconCircleX,
  IconCar,
  IconTruck,
  IconMotorbike,
  IconBus,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconEye,
} from "@tabler/icons-react";
import {
  Badge,
  Tooltip,
  Group,
  Text,
  Paper,
  TextInput,
  Select,
  Button,
  Modal,
} from "@mantine/core";
import type { ParkingSlot } from "../types";
import { getAllSlots } from "../services/slots";

const SlotsTable = () => {
  // State variables
  const [records, setRecords] = useState<ParkingSlot[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ParkingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<ParkingSlot>
  >({
    columnAccessor: "slotNumber",
    direction: "asc",
  });

  // Fetch slots data
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllSlots({ setIsLoading });
      setRecords(data);
      setDataFetched(true);
    };

    fetchData();
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    if (!dataFetched) return;

    // Filter records based on search query and status filter
    let filtered = [...records];

    if (searchQuery) {
      filtered = filtered.filter((slot) => {
        // Search by slot number
        if (slot.slotNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }

        // Search by vehicle plate number if vehicle exists
        if (
          slot.vehicle?.plateNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          return true;
        }

        return false;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((slot) => slot.slotStatus === statusFilter);
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
              ? a.vehicle[child as keyof typeof a.vehicle]
              : null;
          compareB =
            parent === "vehicle" && b.vehicle
              ? b.vehicle[child as keyof typeof b.vehicle]
              : null;
        } else {
          compareA = a[columnAccessor as keyof ParkingSlot];
          compareB = b[columnAccessor as keyof ParkingSlot];
        }

        // Handle nulls
        if (compareA === null || compareA === undefined)
          return direction === "asc" ? -1 : 1;
        if (compareB === null || compareB === undefined)
          return direction === "asc" ? 1 : -1;

        // Compare strings
        if (typeof compareA === "string" && typeof compareB === "string") {
          return direction === "asc"
            ? compareA.localeCompare(compareB)
            : compareB.localeCompare(compareA);
        }

        // Default comparison
        return direction === "asc"
          ? String(compareA).localeCompare(String(compareB))
          : String(compareB).localeCompare(String(compareA));
      });
    }

    // Update state with filtered results
    setFilteredRecords(filtered);
    setTotalRecords(filtered.length);
  }, [records, searchQuery, statusFilter, sortStatus, dataFetched]);

  // Get vehicle type icon
  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case "CAR":
        return <IconCar size={16} />;
      case "TRUCK":
        return <IconTruck size={16} />;
      case "MOTORCYCLE":
        return <IconMotorbike size={16} />;
      case "BUS":
        return <IconBus size={16} />;
      default:
        return null;
    }
  };

  // Handler for viewing slot details
  const handleViewSlot = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setViewModalOpen(true);
  };

  // Handler for refreshing data
  const handleRefresh = async () => {
    setSearchQuery("");
    setStatusFilter("");
    setPage(1);
    setIsLoading(true);

    try {
      const data = await getAllSlots({ setIsLoading });
      setRecords(data);
    } catch (err) {
      console.error("Error refreshing parking slots:", err);
      setIsLoading(false);
    }
  };

  const columns = [
    {
      accessor: "slotNumber",
      title: "Slot Number",
      sortable: true,
    },
    {
      accessor: "slotStatus",
      title: "Status",
      sortable: true,
      render: (slot: ParkingSlot) => (
        <Badge
          color={slot.slotStatus === "AVAILABLE" ? "green" : "red"}
          leftSection={
            slot.slotStatus === "AVAILABLE" ? (
              <IconCircleCheck size={14} />
            ) : (
              <IconCircleX size={14} />
            )
          }
        >
          {slot.slotStatus}
        </Badge>
      ),
    },
    {
      accessor: "vehicle",
      title: "Vehicle",
      sortable: true,
      sortableBy: "vehicle.plateNumber",
      render: (slot: ParkingSlot) => {
        if (!slot.vehicle) return <Text color="dimmed">None</Text>;

        return (
          <Tooltip label={`Owner: ${slot.vehicle.owner?.names || "Unknown"}`}>
            <div>
              <Text fw={500}>{slot.vehicle.plateNumber}</Text>
              <Text size="xs" color="dimmed">
                {slot.vehicle.model} ({slot.vehicle.vehicleType})
              </Text>
            </div>
          </Tooltip>
        );
      },
    },
    {
      accessor: "actions",
      title: "Actions",
      render: (slot: ParkingSlot) => (
        <Group gap="xs" justify="flex-end">
          <Tooltip label="View Details">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => handleViewSlot(slot)}
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
          <TextInput
            placeholder="Search by slot number or plate..."
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
              { value: "AVAILABLE", label: "Available" },
              { value: "OCCUPIED", label: "Occupied" },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value ?? "")}
            width={180}
          />
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
        withTableBorder
        borderRadius="sm"
        shadow="sm"
        withColumnBorders
        striped
        highlightOnHover
        records={filteredRecords}
        columns={columns}
        noRecordsText="No parking slots found"
        loadingText="Loading parking slots..."
        fetching={isLoading}
        page={page}
        onPageChange={setPage}
        recordsPerPage={pageSize}
        onRecordsPerPageChange={setPageSize}
        totalRecords={totalRecords}
        recordsPerPageOptions={[10, 25, 50, 100]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />

      {/* View Slot Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Parking Slot Details"
        size="md"
      >
        {selectedSlot && (
          <div className="space-y-4">
            <div>
              <Text size="sm" color="dimmed">
                Slot Information
              </Text>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text size="sm" color="dimmed">
                    Slot Number
                  </Text>
                  <Text fw={500}>{selectedSlot.slotNumber}</Text>
                </div>
                <div>
                  <Text size="sm" color="dimmed">
                    Status
                  </Text>
                  <Badge
                    color={
                      selectedSlot.slotStatus === "AVAILABLE" ? "green" : "red"
                    }
                  >
                    {selectedSlot.slotStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedSlot.vehicle ? (
              <div>
                <Text size="sm" color="dimmed">
                  Vehicle Information
                </Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text size="sm" color="dimmed">
                      Plate Number
                    </Text>
                    <Group gap="xs">
                      {getVehicleTypeIcon(selectedSlot.vehicle.vehicleType)}
                      <Text>{selectedSlot.vehicle.plateNumber}</Text>
                    </Group>
                  </div>
                  <div>
                    <Text size="sm" color="dimmed">
                      Model
                    </Text>
                    <Text>{selectedSlot.vehicle.model}</Text>
                  </div>
                </div>

                <div className="mt-2">
                  <Text size="sm" color="dimmed">
                    Vehicle Type
                  </Text>
                  <Text>{selectedSlot.vehicle.vehicleType}</Text>
                </div>

                <div className="mt-2">
                  <Text size="sm" color="dimmed">
                    Owner
                  </Text>
                  <Text>{selectedSlot.vehicle.owner?.names || "Unknown"}</Text>
                </div>
              </div>
            ) : (
              <Text>No vehicle currently assigned to this slot.</Text>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SlotsTable;
