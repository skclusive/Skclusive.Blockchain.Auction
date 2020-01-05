import React, { Component } from "react";

import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";

import { Route, Switch } from "react-router";

import List from "./List";
import Item from "./Item";

export class Router extends Component {
  render() {
    const { className: clazz, classes, style } = this.props;
    const className = classNames(classes.root, clazz);
    const { match } = this.props;
    return (
      <div {...{ className, style }}>
        <Switch>
          <Route path={`${match.url}/:addrezz`} component={Item} />
          <Route exact={true} path={match.url} component={List} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(theme => ({
  root: {
    height: "100%"
  }
}))(Router);
