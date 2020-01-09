import React from 'react';
import { Route } from 'react-router-dom';

import PrivateRoute from "../PrivateRoute";

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, authorized, ...rest } = props;
  const DelegateRoute = authorized ? PrivateRoute : Route;
  return (
    <DelegateRoute
      {...rest}
      render={matchProps => (
        <Layout>
          <Component {...matchProps} />
        </Layout>
      )}
    />
  );
};

export default RouteWithLayout;
