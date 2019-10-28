import App from "next/app";
import React from "react";
import styled from "styled-components/macro";
import tw from "tailwind.macro";
import { ThemeProvider } from "styled-components";

import "../styles/app.css";

const theme = {
  colors: {
    primary: "#0070f3"
  }
};

const DevWrapper = styled.div`
  ${tw`max-w-md mx-auto md:mt-10 bg-white shadow-lg`}
`;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <DevWrapper>
          <Component {...pageProps} />
        </DevWrapper>
      </ThemeProvider>
    );
  }
}
