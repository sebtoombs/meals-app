import { useEffect } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

export const login = ({ token }) => {
  cookie.set("token", token, { expires: 1 });
};

export const auth = ctx => {
  const { token } = nextCookie(ctx);

  if (!token) {
    if (ctx.res) {
      res.writeHead(302, {
        Location: "/login"
      });
      res.end();
    } else {
      Router.push("/login");
    }
    return null;
  }
  return token;
};

export const logout = () => {
  cookie.remove("token");
  //Support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
};
