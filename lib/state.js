import React, { createContext, useContext, useReducer, useEffect } from "react";
import { fetchCalendar } from "./api";
import Router from "next/router";

export const StateContext = createContext();
export const StateProvider = ({ children }) => {
  let initialState = {
    //calendar: []
    lastPath: ""
  };
  //let appState = initialState;

  const routeChangeHandler = () => {
    initialState.lastPath = Router.pathname;
  };

  useEffect(() => {
    //const localState = JSON.parse(localStorage.getItem("state"));
    //appState = initialState || localState;
    /*async function fetchData() {
      const calendarData = await fetchCalendar();
      console.log("Load calendar: ", calendarData.calendar);
      initialState.calendar = calendarData.calendar;
    }
    fetchData();*/
    Router.events.on("routeChangeStart", routeChangeHandler);
    return () => {
      Router.events.off("routeChangeStart", routeChangeHandler);
    };
  }, []);

  const reducer = (state, action) => {
    console.log("dispatch", action);
    switch (action.type) {
      case "addToCalendar":
        return {
          ...state,
          calendar: action.calendar
        };
      case "setLastPath":
        console.log("setting", action);
        return {
          ...state,
          lastPath: action.path
        };
      default:
        return state;
    }
  };

  //const [storeValue, setValue] = useReducer(reducer, appState);

  /*useEffect(() => {
    localStorage.setItem("state", JSON.stringify(storeValue));
  }, [storeValue]);*/

  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);
