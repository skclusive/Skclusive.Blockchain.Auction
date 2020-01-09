import React, { Component } from "react";

import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";

export class Timer extends Component {
  state = { diff: 0 };

  render() {
    const { className: clazz, classes, style } = this.props;
    const className = classNames(classes.root, clazz);

    const { diff } = this.state;

    return <div {...{ className, style }}>{`${diff} s`}</div>;
  }

  updateDiff(callback) {
    const { time } = this.props;
    const diff = Math.floor((time - Date.now()) / 1000);
    this.setState(
      () => ({ diff: diff > 0 ? diff : 0 }),
      () => callback(this.state.diff)
    );
  }

  componentDidMount() {
    this.updateDiff(diff => {
      if (diff > 0) {
        this.timer();
      }
    });
  }

  timer() {
    this.timeout = setInterval(() => {
      this.updateDiff(diff => {
        if (diff <= 0) {
          clearInterval(this.timeout);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }
}

export default withStyles(theme => ({
  root: {
    height: "100%",
    width: "100%"
  }
}))(Timer);
