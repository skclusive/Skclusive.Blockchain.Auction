import React, { Component } from "react";
import { Switch } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import Home from "../pages/Home";
import Auction from "../pages/Auction";
import Register from "../pages/Register";
import Scores from "../pages/Scores";
import Settings from "../pages/Settings";
import Admin from "../pages/Admin";

import { BrowserRouter as Router } from "react-router-dom";

import { Main as MainLayout, Minimal as MiniLayout } from "../Layout";

import RouteWithLayout from "../Route/RouteWithLayout";

export default class App extends Component {
  render() {
    return (
      <Router>
        <SnackbarProvider
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          maxSnack={5}
          transitionDuration={{ exit: 1000, enter: 400 }}
        >
          <Switch>
            <RouteWithLayout
              layout={MiniLayout}
              component={Register}
              path="/register/:uuid?"
            />
            <RouteWithLayout
              layout={MainLayout}
              authorized
              exact
              path="/scores"
              component={Scores}
            />
            <RouteWithLayout
              layout={MainLayout}
              authorized
              exact
              path="/auction"
              component={Auction}
            />
            <RouteWithLayout
              layout={MainLayout}
              authorized={false}
              exact
              path="/settings"
              component={Settings}
            />
            <RouteWithLayout
              layout={MainLayout}
              authorized
              exact
              path="/"
              component={Home}
            />
            <RouteWithLayout
              layout={MiniLayout}
              authorized={false}
              exact
              path="/admin"
              component={Admin}
            />
          </Switch>
        </SnackbarProvider>
      </Router>
    );
  }
}
