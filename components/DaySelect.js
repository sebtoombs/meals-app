import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import { MdMoreVert } from "react-icons/md";
import { startOfToday, addDays, format } from "date-fns";

const DaySelectStyled = styled.div`
  ${tw`rounded border-2 border-teal-500 max-w-xs mx-auto`}
`;
const DaySelectItem = styled.button`
  ${tw`text-teal-700 block w-full text-lg px-4 py-3 border-b border-gray-400`}
  ${props =>
    props.secondary ? tw`bg-gray-300 text-gray-700` : null}
  &:first-child {
    ${tw`rounded-t`}
  }
  &:last-child {
    ${tw`rounded-b`}
  }
  svg {
    ${tw`inline-block`}
  }
  ${props => (props.selected ? tw`text-teal-500 bg-teal-100` : null)}
`;

const DaySelect = props => {
  const [value, setValue] = useState(props.value || null);
  const [showMore, setShowMore] = useState(false);

  const handleChange = day => {
    return () => {
      if (typeof props.onChange === "function") {
        props.onChange.call(null, day);
      }
    };
  };

  const dayList = () => {
    let list = showMore
      ? []
      : [
          { date: startOfToday(), name: "Today" },
          { date: addDays(startOfToday(), 1), name: "Tomorrow" }
        ];
    for (let i = 0; i < (showMore ? 7 : 5); i++) {
      let date = addDays(startOfToday(), i + 2 + (showMore ? 5 : 0));
      list = [
        ...list,
        { date: date, name: (showMore ? "Next " : "") + format(date, "EEEE") }
      ];
    }
    return list;
  };

  return (
    <DaySelectStyled>
      {dayList().map((day, index) => (
        <DaySelectItem key={index} onClick={handleChange(day)}>
          {day.name}
        </DaySelectItem>
      ))}
      <DaySelectItem secondary onClick={() => setShowMore(!showMore)}>
        {showMore ? "Less" : "More"} <MdMoreVert />
      </DaySelectItem>
    </DaySelectStyled>
  );
};

export default DaySelect;
