import { Calendar } from "@mantine/dates";
import { useEffect, useState } from "react";
import { OpeningHoursCycle, buildOpeningHoursCycle, calculateOrderDays, createOpeningHours } from "../../_helpers/opening_hours";
import dayjs from 'dayjs';
import { DeliveryType } from "@/_objects/TimeSlot";

interface OpeningHoursCycleCalendarProps {
  startOrder?: string;
  endOrder?: string;
  openingHoursObject?: OpeningHoursCycle;
  openingHoursString?: string;
  deliveryType: DeliveryType;
}

const OpeningHoursCycleCalendar = ({ startOrder, endOrder, openingHoursObject, openingHoursString, deliveryType }: OpeningHoursCycleCalendarProps) => {

  const [deliveryIntervals, setDeliveryIntervals] = useState<[Date, Date, boolean, string | undefined][]>([])
  const [orderDays, setOrderDays] = useState<any>([])

  useEffect(() => {
    const getDeliveryAndOrderDays = async () => {
      if (deliveryType === DeliveryType.DELIVERY_ROUTE) {
        const oh = openingHoursString ? createOpeningHours(openingHoursString) : createOpeningHours(buildOpeningHoursCycle(openingHoursObject!));
        const deliveryIntervals = oh.getOpenIntervals(dayjs().toDate(), dayjs().add(1, 'years').toDate());
        setDeliveryIntervals(deliveryIntervals)
        if (deliveryIntervals) {
          const result = calculateOrderDays(deliveryIntervals, startOrder!, endOrder!);
          setOrderDays(result)
        };
      } else {
        const oh = createOpeningHours(openingHoursString!);
        const openingIntervals = oh.getOpenIntervals(dayjs().toDate(), dayjs().add(1, 'years').toDate());
        setDeliveryIntervals(openingIntervals)
      }
    }
    getDeliveryAndOrderDays();
  }, [openingHoursObject?.daysOfWeek.length, openingHoursObject?.weeks, openingHoursObject?.startDate, openingHoursObject?.endDate, startOrder, endOrder])


  return (
    <Calendar
      locale='fr'
      static
      renderDay={(date) => {
        const deliveryDays = deliveryIntervals.length > 0 && deliveryIntervals.map((range: [Date, Date, boolean, string | undefined]) => range[0]);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const isDeliveryDay = deliveryDays && deliveryDays.some((openedDate: any) =>
          openedDate.getDate() === day &&
          openedDate.getMonth() === month &&
          openedDate.getFullYear() === year
        );
        const canOrder = orderDays && orderDays.some((orderDay: any) =>
          orderDay.getDate() === day &&
          orderDay.getMonth() === month &&
          orderDay.getFullYear() === year
        )

        const style = {
          background: isDeliveryDay && canOrder
            ? 'linear-gradient(90deg, #228BE6 50%, #37d398 50%)' : isDeliveryDay
              ? '#37d398' : canOrder
                ? '#228BE6' : undefined,
          color: isDeliveryDay || canOrder ? '#fff' : undefined,
          borderRadius: isDeliveryDay || canOrder ? '4px' : undefined,
          height: isDeliveryDay || canOrder ? '28px' : undefined,
          width: isDeliveryDay || canOrder ? '28px' : undefined,
          display: isDeliveryDay || canOrder ? 'flex' : undefined,
          alignItems: isDeliveryDay || canOrder ? 'center' : undefined,
          justifyContent: isDeliveryDay || canOrder ? 'center' : undefined
        };

        return (
          <div style={style}>
            {day}
          </div>
        );
      }}
    />
  );
};

export default OpeningHoursCycleCalendar;