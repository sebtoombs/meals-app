import React, { useState } from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import useLongPress from "../utils/useLongPress";
import { MdClose } from "react-icons/md";
import { CardBody } from "../components/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { removeFromCalendar } from "../lib/api";
import useSWR, { mutate } from "swr";
import { useStateValue } from "../lib/state";
const DayEntry = props => {
  const router = useRouter();
  const { day, entry } = props;
  const [isPressed, setIsPressed] = useState(false);
  const [{ lastPath }, dispatch] = useStateValue();

  const onClickHandler = e => {
    if (isPressed) {
      e.preventDefault(); //dont follow link?
      setIsPressed(false);
    } else {
      //dispatch({ type: "setLastPath", path: "/" });
      router.push(`/meals/[id]`, `/meals/${entry.meal.id}`);
    }
  };
  const onLongPressHandler = e => {
    //e.preventDefault();
    setIsPressed(true);
  };
  const removeEntryHandler = async e => {
    await removeFromCalendar(entry.id);
    mutate("calendar");
    console.log("removed");
  };

  return (
    <div css={tw`relative`}>
      <div
        css={`
          ${tw`cursor-pointer`} ${isPressed ? tw`opacity-50` : null}
        `}
        {...useLongPress({
          onClick: onClickHandler,
          onLongPress: onLongPressHandler
        })}
      >
        <div
          css={`
            ${tw`bg-gray-300`} padding-bottom: 56%;
          `}
        ></div>
        <CardBody>
          <p css={tw`text-xl py-2 `}>{entry.meal.name}</p>
          <p css={tw`text-sm text-gray-700`}>{entry.meal.name_extra}</p>
        </CardBody>
        <div css={tw`pb-4`} />
      </div>

      <button
        css={`
          ${tw`absolute p-2 bg-red-500 hidden text-white rounded-full text-lg`} top:10px;
          right: 10px;
          ${isPressed ? `display: block;` : null}
        `}
        onClick={removeEntryHandler}
      >
        <MdClose />
      </button>
    </div>
  );
};
export default DayEntry;
