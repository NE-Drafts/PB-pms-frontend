/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type SetStateAction } from "react";
import { DataTable } from "mantine-datatable";
import {
  IconSearch,
  IconFilter,
  IconRefresh,
  IconEye,
  IconReceipt,
  IconCalendar,
  IconUser,
  IconCar
} from "@tabler/icons-react";
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
  ActionIcon,
} from "@mantine/core";
import { getAllPayments } from "../services/payments";
import type { Payment } from "../types";

const PaymentsTable = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [sortStatus, setSortStatus] = useState<{ columnAccessor: string; direction: "asc" | "desc" }>({
    columnAccessor: "createdAt",
    direction: "desc",
  });

  // Fetch payments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPayments({ setIsLoading });

        console.log(data);
        
        
        const parsedData = data.map((payment: Payment) => ({
          ...payment,
          createdAt: new Date(payment.createdAt),
          updatedAt: payment.updatedAt ? new Date(payment.updatedAt) : null,
          session: {
            ...payment.session,
            entryTime: payment.session?.entryTime ? new Date(payment.session.entryTime) : null,
            exitTime: payment.session?.exitTime ? new Date(payment.session.exitTime) : null,
          }
        }));
        
        setPayments(parsedData);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters, search, and sorting
  useEffect(() => {
    if (!dataFetched) return;

    // Filter payments based on search query and status filter
    let filtered = [...payments];

    if (searchQuery) {
      filtered = filtered.filter((payment) => {
        // Search by payment ID
        if (payment.id?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        
        // Search by session ID
        if (payment.sessionId?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        
        // Search by vehicle plate number if session and vehicle are available
        if (payment.session?.vehicle?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }

        return false;
      });
    }

    if (statusFilter) {
      filtered = filtered.filter((payment) => payment.status === statusFilter);
    }

    // Apply sorting
    if (sortStatus) {
      const { columnAccessor, direction } = sortStatus;

      filtered.sort((a, b) => {
        let compareA, compareB;

        // Handle nested properties like "session.vehicle.plateNumber"
        if (columnAccessor.includes(".")) {
          const parts = columnAccessor.split(".");
          compareA = a;
          compareB = b;
          
          for (const part of parts) {
            compareA = (compareA as any)?.[part];
            compareB = (compareB as any)?.[part];
          }
        } else {
          compareA = a[columnAccessor as keyof Payment];
          compareB = b[columnAccessor as keyof Payment];
        }

        // Handle nulls
        if (compareA === null || compareA === undefined) return direction === "asc" ? -1 : 1;
        if (compareB === null || compareB === undefined) return direction === "asc" ? 1 : -1;

        // Compare dates
        if (compareA instanceof Date && compareB instanceof Date) {
          return direction === "asc"
            ? compareA.getTime() - compareB.getTime()
            : compareB.getTime() - compareA.getTime();
        }

        // Compare numbers or BigInt
        if ((typeof compareA === "number" && typeof compareB === "number") ||
            (typeof compareA === "bigint" && typeof compareB === "bigint")) {
          return direction === "asc" 
            ? Number(compareA) - Number(compareB) 
            : Number(compareB) - Number(compareA);
        }

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
    setFilteredPayments(filtered);
    setTotalRecords(filtered.length);
  }, [payments, searchQuery, statusFilter, sortStatus, dataFetched]);

  // Format date function
  const formatDate = (date: string | number | Date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  // Format amount function
  const formatAmount = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "N/A";
    // Convert BigInt to Number (safe for display purposes)
    const numericAmount = typeof amount === "bigint" ? Number(amount) : amount;
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: "RWF",
    }).format(numericAmount);
  };

  // Handler for viewing payment details
  const handleViewPayment = (payment: SetStateAction<Payment | null>) => {
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  // Handler for refreshing data
  const handleRefresh = async () => {
    setSearchQuery("");
    setStatusFilter("");
    setPage(1);
    setIsLoading(true);
    
    try {
      const data = await getAllPayments({ setIsLoading });
      const parsedData = data.map((payment: { createdAt: string | number | Date; updatedAt: string | number | Date; session: { entryTime: string | number | Date; exitTime: string | number | Date; }; }) => ({
        ...payment,
        createdAt: new Date(payment.createdAt),
        updatedAt: payment.updatedAt ? new Date(payment.updatedAt) : null,
        session: {
          ...payment.session,
          entryTime: payment.session?.entryTime ? new Date(payment.session.entryTime) : null,
          exitTime: payment.session?.exitTime ? new Date(payment.session.exitTime) : null,
        }
      }));
      setPayments(parsedData);
    } catch (err) {
      console.error("Error refreshing payments:", err);
      setIsLoading(false);
    }
  };

  const columns = [
    {
      accessor: "createdAt",
      title: "Date",
      sortable: true,
      render: (payment: Payment) => formatDate(payment.createdAt),
    },
    {
      accessor: "amount",
      title: "Amount",
      sortable: true,
      render: (payment: Payment) => (
        <Text fw={500}>{formatAmount(payment.amount)}</Text>
      ),
    },
    {
      accessor: "status",
      title: "Status",
      sortable: true,
      render: (payment: Payment) => {
        const colorMap = {
          PENDING: "yellow",
          COMPLETED: "green",
        };
        
        return (
          <Badge color={colorMap[payment.status] || "gray"}>
            {payment.status}
          </Badge>
        );
      },
    },
    {
      accessor: "session.vehicle.plateNumber",
      title: "Vehicle",
      sortable: true,
      render: (payment: Payment) => {
        if (!payment.session?.vehicle) return <Text color="dimmed">N/A</Text>;
        
        return (
          <Group gap="xs">
            <IconCar size={16} />
            <Text>{payment.session.vehicle.plateNumber}</Text>
          </Group>
        );
      },
    },
    {
      accessor: "session.status",
      title: "Session Status",
      sortable: true,
      render: (payment: Payment) => {
        if (!payment.session) return <Text color="dimmed">N/A</Text>;
        
        const colorMap = {
          ACTIVE: "blue",
          COMPLETED: "green",
        };
        
        return (
          <Badge color={colorMap[payment.session.status] || "gray"}>
            {payment.session.status}
          </Badge>
        );
      },
    },
    
    {
      accessor: "actions",
      title: "Actions",
      width: 80,
      render: (payment: Payment) => (
        <Group gap="xs" justify="flex-end">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => handleViewPayment(payment)}
            >
              <IconEye size={16} />
            </ActionIcon>
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
            placeholder="Search payments..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            width={250}
          />
          <Select
            placeholder="Payment status"
            clearable
            leftSection={<IconFilter size={16} />}
            data={[
              { value: "", label: "All Statuses" },
              { value: "PENDING", label: "Pending" },
              { value: "COMPLETED", label: "Completed" },
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
        className="w-full"
        borderRadius="sm"
        shadow="sm"
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        records={filteredPayments}
        columns={columns}
        noRecordsText="No payments found"
        loadingText="Loading payments..."
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

      {/* View Payment Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={
          <Group>
            <IconReceipt size={20} />
            <Text fw={600}>Payment Details</Text>
          </Group>
        }
        size="lg"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Payment Basic Info */}
            <div>
              <Text size="sm" fw={500} c="dimmed" mb={8}>Payment Information</Text>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text size="sm" c="dimmed">Payment ID</Text>
                  <Text fw={500}>{selectedPayment.id}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">Amount</Text>
                  <Text fw={500}>{formatAmount(selectedPayment.amount)}</Text>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Text size="sm" c="dimmed">Status</Text>
                  <Badge
                    size="md"
                    color={selectedPayment.status === "COMPLETED" ? "green" : "yellow"}
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <Text size="sm" c="dimmed">Created Date</Text>
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text>{formatDate(selectedPayment.createdAt)}</Text>
                  </Group>
                </div>
              </div>
              {selectedPayment.updatedAt && (
                <div className="mt-3">
                  <Text size="sm" c="dimmed">Last Updated</Text>
                  <Text>{formatDate(selectedPayment.updatedAt)}</Text>
                </div>
              )}
            </div>

            {/* Parking Session Info */}
            {selectedPayment.session && (
              <div>
                <Text size="sm" fw={500} c="dimmed" mb={8}>Parking Session Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text size="sm" c="dimmed">Session ID</Text>
                    <Text>{selectedPayment.session.id}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Status</Text>
                    <Badge
                      color={selectedPayment.session.status === "ACTIVE" ? "blue" : "green"}
                    >
                      {selectedPayment.session.status}
                    </Badge>
                  </div>
                </div>
                
                {selectedPayment.session.vehicle && (
                  <div className="mt-3">
                    <Text size="sm" c="dimmed">Vehicle</Text>
                    <Group gap="xs">
                      <IconCar size={16} />
                      <Text>
                        {selectedPayment.session.vehicle.plateNumber} 
                        {selectedPayment.session.vehicle.model && ` (${selectedPayment.session.vehicle.model})`}
                        {selectedPayment.session.vehicle.vehicleType && `, ${selectedPayment.session.vehicle.vehicleType}`}
                      </Text>
                    </Group>
                  </div>
                )}
                
                {selectedPayment.session.slot && (
                  <div className="mt-3">
                    <Text size="sm" c="dimmed">Parking Slot</Text>
                    <Text>Slot #{selectedPayment.session.slot.slotNumber}</Text>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <Text size="sm" c="dimmed">Entry Time</Text>
                    <Text>{formatDate(selectedPayment.session.entryTime)}</Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Exit Time</Text>
                    <Text>{selectedPayment?.session?.exitTime ? formatDate(selectedPayment.session.exitTime as Date) : "Not exited yet"}</Text>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Owner Info (if available) */}
            {selectedPayment.session?.vehicle?.owner && (
              <div>
                <Text size="sm" fw={500} c="dimmed" mb={8}>Vehicle Owner Information</Text>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text size="sm" c="dimmed">Name</Text>
                    <Group gap="xs">
                      <IconUser size={16} />
                      <Text>{selectedPayment.session.vehicle.owner.names}</Text>
                    </Group>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">Email</Text>
                    <Text>{selectedPayment.session.vehicle.owner.email || "N/A"}</Text>
                  </div>
                  {selectedPayment.session.vehicle.owner.phone && (
                    <div>
                      <Text size="sm" c="dimmed">Phone</Text>
                      <Text>{selectedPayment.session.vehicle.owner.phone}</Text>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Group justify="flex-end" mt="lg">
              <Button variant="default" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              {selectedPayment.status === "COMPLETED" && (
                <Button color="green" leftSection={<IconReceipt size={16} />}>
                  Download Receipt
                </Button>
              )}
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsTable;