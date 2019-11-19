import React, { useEffect, useState } from "react";
import fetch from "isomorphic-unfetch";

import styled from "styled-components/macro";
import tw from "tailwind.macro";

import buildRequestURI from "../lib/buildRequestURI";

import { MdAdd, MdMoreVert } from "react-icons/md";

import Link from "next/link";

import modalService from "../lib/modalService";

import { useStateValue } from "../lib/state";
import Button from "../components/Button";

import { startOfToday, addDays, format, isSameDay, parse } from "date-fns";

import { Card, CardBody, CardHeader } from "../components/Card";
import ClientOnlyPortal from "../components/ClientOnlyPortal";

import FAB from "../components/FAB";
import { toast } from "react-toastify";

import DayEntry from "../components/CalendarDayEntry";
import { fetchCalendar } from "../lib/api";
import useSWR from "swr";

/*HomePage.getInitialProps = async ({ req, query }) => {
  const pageRequest = buildRequestURI(
    "calendar?filter.date.gte=today&limit=14",
    req
  );
  const res = await fetch(pageRequest);
  const json = await res.json();
  console.log("calendar: ", json);
  return json;
};*/

const HomePageStyled = styled.div`
  ${tw`bg-gray-100`}
`;

function HomePage() {
  const { data, error } = useSWR("calendar", fetchCalendar);
  const calendar =
    data && typeof data.calendar !== "undefined" ? data.calendar : [];

  const showAddToCalendarModal = (day = null) => {
    return e => {
      modalService.emit("modal::add_to_calendar::show", { day });
    };
  };

  const renderEmpty = () => {
    return (
      <>
        <div css={tw`px-8 py-20 text-center`}>
          <h1 css={tw`text-center text-4xl mb-5`}>Meals</h1>
          <p css={tw`text-center text-xl mb-4`}>
            There's nothing on your menu yet!
          </p>

          <div css={tw`flex justify-center py-4`}>
            <Button
              size="lg"
              icon={<MdAdd />}
              onClick={showAddToCalendarModal()}
              primary
            >
              Add a meal
            </Button>
          </div>
        </div>
      </>
    );
  };

  const dayList = () => {
    let list = [
      { date: startOfToday(), name: "Today" },
      { date: addDays(startOfToday(), 1), name: "Tomorrow" }
    ];
    for (let i = 0; i < 5 + 7; i++) {
      let date = addDays(startOfToday(), i + 2);
      list = [
        ...list,
        { date: date, name: (i > 5 ? "Next " : "") + format(date, "EEEE") }
      ];
    }
    return list;
  };

  const getEntriesForDay = date => {
    if (!calendar) return;
    let entries = calendar.filter(entry => {
      let entryDate = parse(entry.date, "yyyy-MM-dd", new Date());
      return isSameDay(entryDate, date);
    });
    //.map(entry => entry.meal);
    return entries;
  };

  const renderDays = () => {
    return (
      <>
        <div css={tw`px-2 py-8`}>
          {dayList().map((day, index) => renderDay(day, index))}
        </div>
        <ClientOnlyPortal>
          <FAB onClick={showAddToCalendarModal()}>
            <MdAdd />
          </FAB>
        </ClientOnlyPortal>
      </>
    );
  };

  const renderDay = (day, index) => {
    const entries = getEntriesForDay(day.date);

    return (
      <Card css={tw`mb-12`} key={index}>
        <CardHeader css={tw`flex items-center`}>
          <span
            css={`
              ${tw`pl-4 text-2xl flex`} flex-grow: 1
            `}
          >
            {day.name}
          </span>
          <div>
            <button css={tw`text-xl p-2`}>
              <MdMoreVert />
            </button>
          </div>
        </CardHeader>
        {!entries || entries.length == 0 ? (
          <CardBody>
            <div css={tw`text-center`}>
              <Button css={tw`mx-auto`} onClick={showAddToCalendarModal(day)}>
                Add meal
              </Button>
            </div>
          </CardBody>
        ) : entries.length > 1 ? (
          renderDayMultipleEntries(day, entries)
        ) : (
          renderDaySingleEntry(day, entries[0])
        )}
      </Card>
    );
  };

  const renderDaySingleEntry = (day, entry) => {
    return <DayEntry day={day} entry={entry} />;
  };
  const renderDayMultipleEntries = (day, entries) => {
    return (
      <>
        <div
          css={`
            ${tw`min-w-full flex -mx-2 overflow-x-auto`} min-height:200px;
            &::-webkit-scrollbar {
              display: none;
            }
          `}
        >
          {entries.map((entry, index) => {
            return (
              <div
                key={index}
                css={`
                  ${tw`px-2 cursor-pointer`} min-width: 60%;
                `}
              >
                <DayEntry day={day} entry={entry} />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  if (error) return <div>Something went wrong</div>;
  if (!data) return <div>Loading</div>;
  return (
    <>
      <HomePageStyled>
        {calendar.length ? renderDays() : renderEmpty()}
      </HomePageStyled>
    </>
  );
}

export default HomePage;
