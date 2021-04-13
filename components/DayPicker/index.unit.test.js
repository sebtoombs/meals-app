import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { DayPicker } from "./index";

// let container = null;
// beforeEach(() => {
//   // setup a DOM element as a render target
//   container = document.createElement("div");
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   // cleanup on exiting
//   container.remove();
//   container = null;
// });

// it("renders with or without a name", () => {
//   act(() => {
//     render(<DayPicker />, container);
//   });
//   expect(

//   ).toBe(7);
// });

test("renders correctly", async () => {
  const { getByText } = render(<DayPicker />);

  expect(getByText("Tomorrow")).toBeInTheDocument();

  const items = await screen.findAllByText(/day$/);
  expect(items).toHaveLength(6);
});

// test("selects day", async () => {
//   const { getByText } = render(<DayPicker />);

//   // Click button
//   fireEvent.click(getByText("Today"));

//   // Wait for page to update with query text
//   const items = await screen.findAllByText(/day$/);
//   expect(items).toHaveLength(6);
// });
