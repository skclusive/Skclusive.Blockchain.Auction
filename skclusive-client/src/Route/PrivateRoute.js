import React from "react";

import { Route, Redirect } from "react-router-dom";

import AccountStorage from "../states/Account/AccountStorage";

export default function PrivateRoute({ component: Component, ...rest }) {
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
