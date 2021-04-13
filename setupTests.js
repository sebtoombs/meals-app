// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";
import { server } from "./mocks/server.js";
import "whatwg-fetch";
// import "cross-fetch/polyfill";

// global.fetch = require("jest-fetch-mock");
// global.fetchMock = global.fetch;

// jest.setMock("cross-fetch", fetch); // Use this to mock your ponyfilled fetch module

// // const fetchMock = require("jest-fetch-mock");
// fetchMock.enableMocks();

// beforeEach(() => {
//   fetchMock.doMock();
// });

// Establish API mocking before all tests.
// beforeAll(() => server.listen());
// // Reset any request handlers that we may add during the tests,
// // so they don't affect other tests.
// afterEach(() => server.resetHandlers());
// // Clean up after the tests are finished.
// afterAll(() => server.close());

beforeAll(() => server.listen());
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
