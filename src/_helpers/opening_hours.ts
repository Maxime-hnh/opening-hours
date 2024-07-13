import moment from "moment";
import dayjs from "dayjs";
import opening_hours from 'opening_hours';

export class OpeningHoursCycle {
  constructor(
    public daysOfWeek: number[],
    public weeks: string,
    public startHour: string,
    public endHour: string,
    public startDate?: string | null,
    public endDate?: string | null,
  ) { }

  setDaysOfWeek(dayIndices: number[]): void {
    this.daysOfWeek = dayIndices;
  };

  setWeeks(value: string) {
    this.weeks = value
    return this.weeks
  };
};

type DayOfWeek = 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';
type DaysOfWeekMap = { [key in DayOfWeek]: number };
let daysOfWeekMap: DaysOfWeekMap = {
  'Mo': 0,
  'Tu': 1,
  'We': 2,
  'Th': 3,
  'Fr': 4,
  'Sa': 5,
  'Su': 6
};

export const buildOpeningHoursCycleObject = (openingHoursCycle: string): OpeningHoursCycle | null => {
  // let regex = /(?:([\d]{4} \w{3} \d{2}-[\d]{4} \w{3} \d{2}) )?(week \d+-\d+(?:\/\d+)?)(?: ((?:\w{2},?)+))?(?:\[(1|2|3|-1)\])? (\d{2}:\d{2})-(\d{2}:\d{2})/g;
  let regex = /(?:([\d]{4} \w{3} \d{2}-[\d]{4} \w{3} \d{2}) )?(week \d+-\d+(?:\/\d+)?) (?:((?:\w{2},?)+) )?(\d{2}:\d{2})-(\d{2}:\d{2})/g;

  let matches = [];
  let match;

  while ((match = regex.exec(openingHoursCycle)) !== null) {
    let days = match[3] ? match[3].split(',').map(day => daysOfWeekMap[day.trim() as DayOfWeek]) : [];
    matches.push({
      daysOfWeek: days,
      startDate: match[1] ? match[1].split('-')[0].trim() : '',
      endDate: match[1] ? match[1].split('-')[1].trim() : '',
      weeks: match[2],
      startHour: match[4],
      endHour: match[5],
    });
  }
  if (matches.length === 0) return null;

  let result = {
    daysOfWeek: [] as number[],
    weeks: matches[0].weeks,
    startHour: '00:00',
    endHour: '23:59',
    startDate: matches[0]?.startDate || '',
    endDate: matches[0]?.endDate || '',
  };

  matches.forEach(match => {
    result.daysOfWeek = [...new Set([...result.daysOfWeek, ...match.daysOfWeek])].sort((a, b) => a - b);
    result.startHour = match.startHour !== '00:00' ? match.startHour : result.startHour;
    result.endHour = match.endHour !== '23:59' ? match.endHour : result.endHour;
  });
  let openingHoursChoice = new OpeningHoursCycle(result.daysOfWeek, result.weeks, result.startHour, result.endHour, result.startDate, result.endDate)
  return openingHoursChoice;
};

export const buildOpeningHoursCycle = (object: OpeningHoursCycle, setOpeningHours?: (data: string) => void): string => {
  //reverse daysOfWeekMap => {0 : 'Mo'}
  let indexToDayMap = Object.keys(daysOfWeekMap).reduce((acc: { [key: number]: string }, day) => {
    acc[daysOfWeekMap[day as DayOfWeek]] = day;
    return acc;
  }, {});
  const days = object.daysOfWeek.map(index => indexToDayMap[index]);
  if (days.length > 0) {
    const openingHours = days.map((day, index) => {
      let startTime = "00:00";
      let endTime = "23:59";
      const lastIndex = index === days.length - 1
      if (index === 0 && object.startHour) {
        startTime = object.startHour;
      };
      if (lastIndex && object.endHour) {
        endTime = object.endHour;
      };
      const startDate = object.startDate ? (object.startDate) : ''
      const endDate = object.endDate ? (object.endDate + ' ') : ''
      return `${startDate}${startDate && endDate && '-'}${endDate}${object.weeks} ${day} ${startTime}-${endTime}${lastIndex ? '' : ';'}`
    }).join(' ');
    setOpeningHours && setOpeningHours(openingHours);
    return openingHours
  } else {
    let startTime = "00:00";
    let endTime = "23:59";
    const startDate = object.startDate ? (object.startDate) : ''
    const endDate = object.endDate ? (object.endDate + ' ') : ''
    const openingHours = `${startDate}${startDate && endDate && '-'}${endDate}${object.weeks} ${startTime}-${endTime}`
    setOpeningHours && setOpeningHours(openingHours);
    return openingHours
  }
};

export const createOpeningHours = (osmOpeningHours: string): opening_hours => {
  // TODO avoid hardcoding those "locale" values
  return new opening_hours(osmOpeningHours);
}

export function nextOpenDay(osmOpeningHours: string): Date | undefined {
  const osmHoursChecker: opening_hours = createOpeningHours(osmOpeningHours);
  const nextChange: Date | undefined = osmHoursChecker.getNextChange(new Date());
  return nextChange;
};

export function calculateOrderDays(deliveryIntervals: [Date, Date, boolean, string | undefined][], startDaysBefore: string, endDaysBefore: string) {
  const orderDaysArray: any = []
  const firstDayOfWeekArray = deliveryIntervals.filter(interval => interval[0].getDay() === deliveryIntervals[0][0].getDay());

  firstDayOfWeekArray.forEach((interval) => {
    const firstDeliveryDay = moment(interval[0]);
    const hours = firstDeliveryDay.hours() * 60;
    const minutes = firstDeliveryDay.minutes();
    const orderDay = firstDeliveryDay.clone().subtract((parseInt(startDaysBefore) + hours + minutes), 'minutes');
    //If endDaysBefore is only 1h/2h/4h before firstDeliveryDay we substract only these hours to allow order during firstDeliveryDay
    //Else we add hours and minutes + 1 to make sure closingDay end at 23:59
    const closingDay = firstDeliveryDay.clone().subtract(parseInt(endDaysBefore) < 241 ? endDaysBefore : (parseInt(endDaysBefore) + hours + minutes + 1), 'minutes');

    let currentDay = orderDay;
    while (currentDay.isSameOrBefore(closingDay, 'day')) {
      orderDaysArray.push(moment(currentDay).toDate());
      currentDay.add(1, 'day');
    }
  });
  return orderDaysArray;
};

export function getNextClosingTime(osmOpeningHours: string): any {
  const now = new Date();
  const osmHoursChecker: opening_hours = createOpeningHours(osmOpeningHours);
  const nextClosingTime = osmHoursChecker.getNextChange(now);
  const duration = moment.duration(moment(nextClosingTime).diff(now));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  return `Il reste ${days} jours ${hours} heures et ${minutes} minutes avant la fermeture des commandes.`;
};

export function OpeningHoursTimer(osmOpeningHours: string, setter: (timeRemaning: string) => void) {
  if (osmOpeningHours === 'week 01-52 00:00-23:59') return;
  const openingHours = new opening_hours(osmOpeningHours);
  const updateTimer = () => {
    const now = moment();
    const nextClosingTime = openingHours.getNextChange(now.toDate());

    if (nextClosingTime) {
      const duration = moment.duration(moment(nextClosingTime).diff(now));
      const days = duration.days();
      const hours = duration.hours();
      const minutes = duration.minutes();
      setter(`${days !== 0 ? `${days}J, ` : ''}${hours}:${minutes} heures`);
    } else {
      setter("L'établissement est actuellement fermé.");
    }
  };
  updateTimer();
  const intervalId = setInterval(updateTimer, 1000);
  return () => clearInterval(intervalId);
}
