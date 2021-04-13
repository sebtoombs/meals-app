import { forwardRef, useState, useEffect } from "react";
import { startOfDay, addDays, format } from "date-fns";
import { Wrap, WrapItem, Box, Button } from "@chakra-ui/react";
import ucFirst from "../../lib/ucFirst";

export const DayPicker = forwardRef(function DayPicker(
  { name = null, value: initialValue = null, onChange = null },
  ref
) {
  const [value, setValue] = useState(initialValue);

  const todayDate = startOfDay(new Date());
  const today = format(todayDate, "EEEE").toLowerCase();
  const daysRaw = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  daysRaw.splice(7, 0, ...daysRaw);

  // Remove all elements before today
  let todayIndex = daysRaw.indexOf(today);
  daysRaw.splice(0, todayIndex);
  // Remove all elements after the last occurrence of today
  todayIndex = daysRaw.slice(1).indexOf(today);
  daysRaw.splice(todayIndex + 1, daysRaw.length - todayIndex);

  // Create an object for each day with the value (day string), label, date
  const days = daysRaw.map((dayString, index) => {
    const date = addDays(todayDate, index);
    const dayObj = {
      label: ucFirst(dayString),
      date,
      value: format(date, "yyyy-MM-dd"),
    };
    if (index === 0) {
      dayObj.label = "Today";
    }
    if (index === 1) {
      dayObj.label = "Tomorrow";
    }
    return dayObj;
  });

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange.call(null, value);
    }
  }, [value]);

  return (
    <>
      <DayPickerView
        name={name}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
        days={days}
        ref={ref}
      />
    </>
  );
});

export const DayPickerView = forwardRef(function DayPickerView(
  { name, value, onChange, days },
  ref
) {
  return (
    <Wrap ref={ref}>
      {days.map(({ value: dayValue, label: dayLabel }, index) => (
        <WrapItem key={index} position="relative">
          <Box
            as="input"
            type="radio"
            name={name}
            value={dayValue}
            position="absolute"
            opacity="0"
            className="daypicker--input"
            id={`input-${dayValue}`}
            selected={value === dayValue}
            onChange={(e) => onChange(e.target.value)}
          />
          <Button
            bg={value === dayValue ? "teal.500" : "white"}
            variant={value === dayValue ? "solid" : "outline"}
            border="1px solid"
            borderColor={value === dayValue ? "teal.500" : "gray.300"}
            colorScheme={value === dayValue ? "teal" : "gray"}
            fontWeight="normal"
            as="label"
            className="daypicker--label"
            htmlFor={`input-${dayValue}`}
            cursor="pointer"
          >
            {dayLabel}
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
});
