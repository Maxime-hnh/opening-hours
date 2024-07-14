
import moment from 'moment';
import React, { RefObject, useContext, useRef, useState } from 'react';
import { ActionIcon, Group, Text, rem } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import useWindowSize from '../Utils/useWindowSize';
import { OpeningHoursCycle } from '@/_helpers/opening_hours';
import AppContext from '@/app/Context/AppContext';
import { IconClock } from '@tabler/icons-react';

export interface DaysPickerProps {
  openingHoursObject: OpeningHoursCycle;
  setOpeningHoursObject: (data: OpeningHoursCycle) => void;
};

const DaysPicker = ({ openingHoursObject, setOpeningHoursObject }: DaysPickerProps) => {
  const { width }: { width: number } = useWindowSize()
  const { isMobile }: { isMobile: boolean } = useContext(AppContext)
  const refTime1 = useRef<HTMLInputElement>(null);
  const refTime2 = useRef<HTMLInputElement>(null);
  const [openingDays, setOpeningDays] = useState(openingHoursObject.daysOfWeek);

  const daysOfWeek = moment.weekdays();
  const sunday = daysOfWeek.shift();
  daysOfWeek.push(sunday!);
  const selectValues = daysOfWeek.map((day, index) => ({ label: day, index: index }));

  const pickerClock = (ref: RefObject<HTMLInputElement>) => {
    return (
      <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
        <IconClock style={{ width: rem(12), height: rem(12) }} stroke={1} />
      </ActionIcon>
    )
  };

  const isAdjacent = (index: number) => {
    if (openingDays.length === 0) return true;
    const min = Math.min(...openingDays);
    const max = Math.max(...openingDays);
    return index === min - 1 || index === max + 1;
  };

  const areDaysConsecutive = (days: number[]) => {
    for (let i = 0; i < days.length - 1; i++) {
      if (days[i] + 1 !== days[i + 1]) {
        return false;
      }
    };
    return true;
  };

  const handleDayClick = (index: number) => {
    let newDaysOfWeek;
    if (openingDays.includes(index)) {
      const potentialNewDays = openingDays.filter(item => item !== index);
      if (areDaysConsecutive(potentialNewDays.sort((a, b) => a - b))) {
        newDaysOfWeek = potentialNewDays;
      } else {
        return;
      }
    } else if (isAdjacent(index)) {
      newDaysOfWeek = [...openingDays, index].sort((a, b) => a - b);
    } else {
      return;
    }
    openingHoursObject.setDaysOfWeek(newDaysOfWeek);
    setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), openingHoursObject))
  };

  return (
    <div className='step_container'>
      <Text
        className='radio_group'
        style={{ textAlign: 'center' }}
      >
        Sélectionnez le(s) jour(s) de livraison
      </Text>
      <Group className='dayPicker_container' justify="center" align="center" gap={0} wrap='nowrap'>
        {selectValues.map(({ label, index }) => {
          const selectedIndexes = openingHoursObject.daysOfWeek.sort((a, b) => a - b);
          const firstSelectedIndex = selectedIndexes[0];
          const lastSelectedSelectedIndex = selectedIndexes[selectedIndexes.length - 1];
          return (
            <React.Fragment key={index}>
              {index === firstSelectedIndex && (
                <TimeInput
                  size={isMobile ? 'xs' : 'sm'}
                  ref={refTime1}
                  rightSection={pickerClock(refTime1)}
                  value={openingHoursObject.startHour}
                  onChange={(e) => {
                    openingHoursObject.startHour = e.target.value
                    setOpeningHoursObject(openingHoursObject)
                    setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), openingHoursObject))
                  }}
                />
              )}
              <Text p={0} pt={3} pb={3}
                style={{
                  borderRight: index === selectValues.length - 1 ? 'none' : '1px solid #fff',
                  borderRadius:
                    (index === 0 && !openingDays.includes(index)) ? '12px 0 0 12px'
                      : (index === selectValues.length - 1 && !openingDays.includes(selectValues.length - 1)) ? '0 12px 12px 0' : 'none',
                  background: openingDays.includes(index) ? '#37d398' : '',
                  color: openingDays.includes(index) ? '#fff' : '',
                  opacity: isAdjacent(index) || openingDays.includes(index) ? 1 : 0.5,
                  cursor: isAdjacent(index) || openingDays.includes(index) ? 'pointer' : 'auto'

                }}
                className='dayPicker_text'
                onClick={() => handleDayClick(index)}
              >
                {width > 1023 ? label.substring(0, 3) : label.substring(0, 1)}
              </Text>
              {index === lastSelectedSelectedIndex && (
                <TimeInput
                  size={isMobile ? 'xs' : 'sm'}
                  ref={refTime2}
                  rightSection={pickerClock(refTime2)}
                  value={openingHoursObject.endHour}
                  onChange={(e) => {
                    openingHoursObject.endHour = e.target.value
                    setOpeningHoursObject(openingHoursObject)
                    setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), openingHoursObject))
                  }}
                />
              )}
            </React.Fragment>
          )
        })}
      </Group>

    </div>
  );
};

export default DaysPicker;