export type LoginInputs = {
  email: string;
  password: string;
};

export type Role = "ADMIN" | "USER";

export type SignupInputs = {
  names: string;
  email: string;
  phone: string;
  password: string;
};

export interface User {
  id: string;
  names: string;
  email: string;
  phone: string;
  role: Role | string;
}

export type ParkingSessionStatus = "ACTIVE" | "COMPLETED";
export type PaymentStatus = "PENDING" | "COMPLETED";
export type VehicleType = "CAR" | "TRUCK" | "MOTORCYCLE" | "BUS";
export type SlotStatus = "AVAILABLE" | "OCCUPIED";

export interface Payment {
  id: string;
  amount: number | null;
  status: PaymentStatus;
  sessionId: string;
  session: ParkingSession;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  vehicleType: VehicleType;
  owner: User;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  vehicle?: Vehicle;
  slotStatus: SlotStatus;
}

export interface ParkingSession {
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
