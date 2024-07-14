export enum TimeSlotState {
  CLOSED = 'CLOSED',
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT'
}

export enum DeliveryType {
  PICK_UP_POINT = "PICK_UP_POINT",
  DELIVERY_ROUTE = "DELIVERY_ROUTE"
}

interface TimeSlotParams {
  startOrderBefore?: string;
  endOrderBefore?: string;
};

export type TimeSlotProps = Partial<{
  id: number;
  cur: string;
  name: string;
  description?: string;

  openingHours: string;
  isOpen: boolean;
  startOrderDate?: Date | null;
  endOrderDate?: Date | null;

  type : DeliveryType;
  state: TimeSlotState;
  isPublic: boolean;
  params: TimeSlotParams;

  update?: boolean;
}>;

export type FetchedTimeSlot = {
  id: number;
} & TimeSlotProps;

export default class TimeSlot implements TimeSlotProps {
  name = '';
  description = '';
  isPublic = true;
  state = TimeSlotState.ACTIVE;
  startOrderDate = null;
  endOrderDate = null;
  type = DeliveryType.DELIVERY_ROUTE
  openingHours = '';
  update = false;
};