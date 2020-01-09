import React from "react";

import { Route, Redirect } from "react-router-dom";

import AccountStorage from "../states/Account/AccountStorage";

export default function PrivateRoute({ render, ...rest }) {
  const redirect = !AccountStorage.stored.uuid;
  return (
    <Route
      {...rest}
      render={props =>
        !redirect ? (
          render(props)
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
