import * as React from "react";
import { Wrapper } from "../pages/_app";
import { Calendar, CalendarView } from "../components/Calendar";
import useCalendar from "../lib/queries/useCalendar";
import { renderHook, act } from "@testing-library/react-hooks";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import { request, gql } from "graphql-request";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// const queryClient = new QueryClient();
// const wrapper = ({ children }) => (
//   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// );

const flushPromises = () => new Promise(setImmediate);

test("Calendar renders", async () => {
  const { asFragment } = render(
    <Wrapper>
      <Calendar />
    </Wrapper>
  );
  await flushPromises();
  // expect(await screen.findByText(/pizza/i)).toBeInTheDocument();
  const firstRender = asFragment();
  expect(firstRender).toMatchSnapshot();
});
