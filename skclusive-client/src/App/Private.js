import React from "react";

import { Route, Redirect } from "react-router-dom";

import AccountStorage from "./states/Home/AccountStorage";

export default function Private({ component: Component, ...rest }) {
  const redirect = !AccountStorage.stored.uuid;
  return (
    <Route
      {...rest}
      render={props =>
        !redirect ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/register",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
