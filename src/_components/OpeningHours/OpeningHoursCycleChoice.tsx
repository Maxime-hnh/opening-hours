
import { useEffect, useState } from 'react';
import { Flex, Grid, Group, Radio, Select, Text, ThemeIcon, Transition, rem } from '@mantine/core';
import { IconCalendar, IconCalendarWeek, IconRotateClockwise } from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { momentWithLocale } from '../../_helpers/helper';
import { OpeningHoursCycle, buildOpeningHoursCycle, buildOpeningHoursCycleObject } from '../../_helpers/opening_hours';
import './OpeningHoursCycleChoice.scss';
import OpeningHoursCycleCalendar from './OpeningHoursCycleCalendar';
import DatePicker from './DatePicker';
import DaysPicker from './DaysPicker';
import { DeliveryType, FetchedTimeSlot } from '@/_objects/TimeSlot';

export interface OpeningHoursCycleChoiceProps {
  openingHours?: string;
  timeSlot?: FetchedTimeSlot;
  onOpeningHoursUpdated: (openinHours: string) => void;
  isSubmitting: boolean;
  onDateUpdated: (fieldName: string, newDate: any) => void;
  onOAUpdated: (fieldName: string, value: any) => void;
};

const OpeningHoursCycleChoice = ({ openingHours: initialOSMOpeningHours, timeSlot, onOpeningHoursUpdated, isSubmitting, onDateUpdated, onOAUpdated }: OpeningHoursCycleChoiceProps) => {

  const [openingHours, setOpeningHours] = useState<string>('week 01-52 08:00-18:00');
  const [startOrder, setStartOrder] = useState<string | undefined>(timeSlot ? timeSlot.params?.startOrderBefore : '');
  const [endOrder, setEndOrder] = useState<string | undefined>(timeSlot ? timeSlot.params?.endOrderBefore : '');
  const [openingHoursObject, setOpeningHoursObject] = useState<OpeningHoursCycle>(new OpeningHoursCycle([], 'week 01-52', '08:00', '18:00'))
  const [isAllYear, setIsAllYear] = useState<boolean>(openingHoursObject.startDate ? false : true);
  const [isWeekly, setIsWeekly] = useState<boolean>(openingHoursObject.weeks ? true : false);

  const handleNewDate = (e: Date | null, isStartDate: boolean) => {
    const fieldName = isStartDate ? 'startOrderDate' : 'endOrderDate';
    const objectDateKey = isStartDate ? 'startDate' : 'endDate';
    const formattedDate = e ? momentWithLocale('en', () => dayjs(e).format("YYYY MMM DD")) : '';
    onDateUpdated(fieldName, e ? e : '');
    openingHoursObject[objectDateKey] = formattedDate;
    setOpeningHoursObject(openingHoursObject)
    setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), openingHoursObject));
  };

  console.log(openingHoursObject)

  useEffect(() => {
    if (!isSubmitting && initialOSMOpeningHours) {
      setOpeningHours(initialOSMOpeningHours)
      const newOpeningHoursObject = buildOpeningHoursCycleObject(initialOSMOpeningHours)!
      if (newOpeningHoursObject) {
        setOpeningHoursObject(newOpeningHoursObject)
        setIsAllYear(newOpeningHoursObject.startDate ? false : true)
      }
    }
    if (isSubmitting) {
      const openingHours = buildOpeningHoursCycle(openingHoursObject, setOpeningHours);
      onOpeningHoursUpdated(openingHours)
    }
  }, [isSubmitting])

  useEffect(() => {
    setIsWeekly(openingHoursObject.weeks === 'week 01-52' ? true : false);
  }, [openingHoursObject.weeks]);

  return (
    <Grid id='openingHoursCycleChoice'>
      <Grid.Col span={6}>
        <DatePicker
          openingHoursObject={openingHoursObject}
          handleNewDate={handleNewDate}
          setOpeningHoursObject={setOpeningHoursObject}
          isAllYear={isAllYear}
          setIsAllYear={setIsAllYear}
        />
        <DaysPicker
          key={openingHoursObject.daysOfWeek.length}
          openingHoursObject={openingHoursObject}
          setOpeningHoursObject={(data) => setOpeningHoursObject(data)}
        />

        <div className='step_container'>
          <Radio.Group
            className='radio_group'
            label="Souhaitez-vous un rythme hebdomadaire ?"
            value={isWeekly ? 'oui' : 'non'}
            style={{ marginBottom: isWeekly ? '' : '1rem' }}
          >
            <Group align="center" justify="center">
              <Radio value={'oui'} label="Oui" onChange={() => {
                setIsWeekly(true);
                openingHoursObject.setWeeks('week 01-52');
                setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), openingHoursObject));
              }}
              />
              <Radio value={'non'} label="Non" onChange={() => setIsWeekly(false)} />
            </Group>
          </Radio.Group>
          <Transition
            mounted={!isWeekly}
            transition='scale-y'
            duration={250}
            exitDuration={250}
            timingFunction="ease"
          >
            {(styles) =>
              <div style={styles}>
                <Select
                  mt={5}
                  value={openingHoursObject.weeks}
                  data={[
                    { value: 'week 01-52/2', label: 'Toutes les 2 semaines' },
                    { value: 'week 01-52/3', label: 'Toutes les 3 semaines' },
                  ]}
                  placeholder='Sélectionner une fréquence'
                  checkIconPosition="left"
                  leftSection={<IconRotateClockwise style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                  onChange={(value) => {
                    openingHoursObject.setWeeks(value!);
                    setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), openingHoursObject))
                  }}
                />
              </div>
            }
          </Transition>
        </div>
      </Grid.Col>
      <Grid.Col span={6} style={{borderLeft: "1px solid #e7e7e7"}}>
        <Group justify='space-evenly'>
          <Flex direction={'column'}>
            <Text>Ouverture des commandes</Text>
            <Select
              value={startOrder}
              data={[
                { value: '1440', label: '1 jour avant' },
                { value: '2880', label: '2 jours avant' },
                { value: '4320', label: '3 jours avant' },
                { value: '5760', label: '4 jours avant' },
                { value: '7200', label: '5 jours avant' },
                { value: '8640', label: '6 jours avant' },
              ]}
              placeholder='3 jours avant'
              checkIconPosition="left"
              leftSection={<IconCalendarWeek style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
              onChange={(value) => {
                setStartOrder(value!);
                onOAUpdated('params.startOrderBefore', value)
              }}
            />
          </Flex>
          <Flex direction={'column'}>
            <Text>Clôture des commandes</Text>
            <Select
              value={endOrder}
              data={[
                { value: '60', label: '1 heure avant' },
                { value: '120', label: '2 heures avant' },
                { value: '240', label: '4 heures avant' },
                { value: '1440', label: '1 jour avant' },
                { value: '2880', label: '2 jours avant' },
                { value: '4320', label: '3 jours avant' },
                { value: '5760', label: '4 jours avant' },
                { value: '7200', label: '5 jours avant' },
              ]}
              placeholder='1 jour avant'
              checkIconPosition="left"
              leftSection={<IconCalendarWeek style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
              onChange={(value) => {
                setEndOrder(value!)
                onOAUpdated('params.endOrderBefore', value)
              }}
            />
          </Flex>
        </Group>
        <Flex align={'center'} justify={'center'} direction={'column'}>
          <OpeningHoursCycleCalendar
            openingHoursObject={openingHoursObject}
            startOrder={startOrder}
            endOrder={endOrder}
            deliveryType={DeliveryType.DELIVERY_ROUTE}
          />
          <Group mt={15}>
            <Flex align={'center'}>
              <ThemeIcon color='#228BE6' size={'md'}>
                <IconCalendar color='#fff' size={'xs'} />
              </ThemeIcon>
              <Text size='xs' ml={5}>Jour(s) de commande</Text>
            </Flex>
            <Flex align={'center'}>
              <ThemeIcon color='#37d398' size={'md'}>
                <IconCalendar color='#fff' />
              </ThemeIcon>
              <Text size='xs' ml={5}>Jour(s) de livraison</Text>
            </Flex>
          </Group>
        </Flex>
      </Grid.Col>
    </Grid>

  )
};
export default OpeningHoursCycleChoice;