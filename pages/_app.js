import App, { Container } from "next/app";
import React from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import { ThemeProvider } from "styled-components";

import "../styles/app.css";
import ModalAddToCalendar from "../components/ModalAddToCalendar";

import Modal from "react-modal";

import buildRequestURI from "../lib/buildRequestURI";

import { StateProvider } from "../lib/state";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BottomNavigation from "../components/BottomNavigation";

import { MdClose } from "react-icons/md";
const CloseButton = ({ className, closeToast }) => (
  <button
    onClick={closeToast}
    className={`${className} Toastify__close-button Toastify__close-button--default`}
    type="button"
    aria-label="close"
  >
    <MdClose />
  </button>
);

toast.configure({
  position: toast.POSITION.BOTTOM_CENTER,
  autoClose: 2500,
  closeButton: <CloseButton />,
  className: process.env.NODE_ENV === "production" ? "" : "toast-container"
});

const theme = {
  colors: {
    primary: "#0070f3"
  }
};

const DevWrapper = styled.div`
  ${tw`max-w-md mx-auto md:mt-10 bg-white shadow-lg flex relative overflow-y-scroll`} min-height: 812px;
  max-height: 812px;
  & > * {
    width: 100%;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default class MyApp extends App {
  async componentDidMount() {
    Modal.setAppElement("#devWrapper");

    /*const calendar = await this.fetchCalendar();
    this.setState({
      calendar: [1, 2, 3] //json.calendar
    });*/
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <DevWrapper id="devWrapper">
          <StateProvider>
            <Component {...pageProps} />
            <ModalAddToCalendar />
            <BottomNavigation />
          </StateProvider>
        </DevWrapper>
      </ThemeProvider>
    );
  }
}
