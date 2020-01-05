import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { SnackbarProvider } from "notistack";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Auction from "./pages/Auction";
import Register from "./pages/Register";
import LeaderBoard from "./pages/LeaderBoard";

import Admin from './pages/admin';

import { BrowserRouter as Router } from "react-router-dom";

import Private from "./Private";

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <SnackbarProvider
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            maxSnack={5}
            transitionDuration={{ exit: 1000, enter: 400 }}
          >
            <Switch>
              <Route path="/register/:uuid?" component={Register} />
              <Private exact path="/dashboard" component={Home} />
              <Private exact path="/games/leaderboard" component={LeaderBoard} />
              <Private path="/games/auction" component={Auction} />
              <Private exact path="/games" component={Games} />
              <Private exact path="/" component={Home} />
              <Route exact path="/admin" component={Admin} />
            </Switch>
          </SnackbarProvider>
        </div>
      </Router>
    );
  }
}
