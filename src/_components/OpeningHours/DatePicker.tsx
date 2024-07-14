
import { Dispatch, SetStateAction } from 'react';
import { Group, Radio, Transition, rem } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { OpeningHoursCycle } from '../../_helpers/opening_hours';
import { IconCalendar } from '@tabler/icons-react';

interface DatePickerProps {
  openingHoursObject: OpeningHoursCycle;
  handleNewDate: (e: Date | null, isStartDate: boolean) => void;
  setOpeningHoursObject: (data: OpeningHoursCycle) => void;
  isAllYear: boolean;
  setIsAllYear: Dispatch<SetStateAction<boolean>>;
};

const DatePicker = ({ openingHoursObject, handleNewDate, setOpeningHoursObject, isAllYear, setIsAllYear }: DatePickerProps) => {

  const iconCalendar = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

  return (
    <div className='step_container' style={{ paddingTop: 0 }}>
      <Radio.Group
        label="Livraison toute l’année ?"
        value={isAllYear ? 'oui' : 'non'}
        className="radio_group"
        style={{ marginBottom: isAllYear ? '' : '1rem' }}
      >
        <Group align="center" justify="center">
          <Radio value={'oui'} label="Oui" onChange={() => {
            setIsAllYear(true)
            const newOpeningHoursObject = new OpeningHoursCycle([], 'week 01-52', '00:00', '23:59')
            setOpeningHoursObject(Object.assign(new OpeningHoursCycle([], '', '', ''), newOpeningHoursObject));
          }}
          />
          <Radio value={'non'} label="Non" onChange={() => setIsAllYear(false)} />
        </Group>
      </Radio.Group>
      <Transition
        mounted={!isAllYear}
        transition='scale-y'
        duration={250}
        exitDuration={250}
        timingFunction="ease"
      >
        {(styles) =>
          <div style={styles}>
            <div className='datesPicker_container'>
              {!isAllYear && (
                <>
                  <DatePickerInput
                    clearable
                    locale="fr"
                    name="startOrderDate"
                    placeholder='Sélectionnez une date'
                    leftSection={iconCalendar}
                    leftSectionPointerEvents="none"
                    value={openingHoursObject.startDate ? new Date(openingHoursObject.startDate) : null}
                    valueFormat="DD MMM YYYY"
                    label="Début :"
                    onChange={(e) => handleNewDate(e, true)}
                    className='datePickerInput'
                  />
                  <DatePickerInput
                    clearable
                    locale="fr"
                    name="endOrderDate"
                    placeholder='Sélectionnez une date'
                    leftSection={iconCalendar}
                    leftSectionPointerEvents="none"
                    value={openingHoursObject.endDate ? new Date(openingHoursObject.endDate) : null}
                    valueFormat="DD MMM YYYY"
                    label="Fin :"
                    onChange={(e) => handleNewDate(e, false)}
                    className='datePickerInput'
                  />
                </>
              )}
            </div>
          </div>
        }
      </Transition>
    </div>
  )
};

export default DatePicker;