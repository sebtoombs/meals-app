import React, { Component } from "react";
import Router from "next/router";

export default function withAuth(AuthComponent) {
  return class Authenticated extends Component {
    static async getInitialProps({ ctx, res }) {
      console.log("withAuth getInitialProps");
      let pageProps = {};
      if (AuthComponent.getInitialProps) {
        pageProps = await AuthComponent.getInitialProps(ctx);
      }

      if (!pageProps.user) {
        if (res) {
          res.writeHead(302, {
            Location: "/login"
          });
          res.end();
        } else {
          Router.push("/login");
        }
        return {};
      }

      return { pageProps };
    }

    render() {
      return <AuthComponent {...this.props} />;
    }
  };
}
