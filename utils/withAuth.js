import React, { Component } from "react";
import Router from "next/router";
import { auth } from "../lib/auth";

export default function withAuth(AuthComponent) {
  return class Authenticated extends Component {
    syncLogout(event) {
      if (event.key === "logout") {
        console.log("Logged out from storage!");
        Router.push("/login");
      }
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }
    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    static async getInitialProps({ ctx, res }) {
      console.log("withAuth getInitialProps");
      let pageProps = {};
      if (AuthComponent.getInitialProps) {
        pageProps = await AuthComponent.getInitialProps(ctx);
      }

      //const token = auth(ctx);
      /*if (!pageProps.user) {
        if (res) {
          res.writeHead(302, {
            Location: "/login"
          });
          res.end();
        } else {
          Router.push("/login");
        }
        return {};
      }*/

      //return { ...pageProps, token };
      return { ...pageProps };
    }

    render() {
      return <AuthComponent {...this.props} />;
    }
  };
}
