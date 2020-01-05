import * as React from "react";
import { Component } from "react";

import { create } from "jss";
import preset from "jss-preset-default";
import JssProvider from "react-jss/lib/JssProvider";

import createGenerateClassName from "@material-ui/core/styles/createGenerateClassName";

import createTheme from "@material-ui/core/styles/createMuiTheme";

import CssBaseline from "@material-ui/core/CssBaseline";
import ThemeProvider from "@material-ui/core/styles/MuiThemeProvider";


import red from "@material-ui/core/colors/red";

// Create a JSS instance with the default preset of plugins.
// It's optional.

const jss = create(preset());

const generateClassName = createGenerateClassName();

export default class Theme extends Component {
  render() {
    const { children, theme } = this.props;
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeProvider theme={this.getTheme(theme)}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </JssProvider>
    );
  }

  getTheme(theme) {
    return createTheme({
      palette: {
        contrastThreshold: 3,
        error: {
          main: red[500]
        },
        // primary: indigo,
        // secondary: lightBlue,
        tonalOffset: 0.2,
        type: theme
      },
      typography: {
        useNextVariants: true
      }
    });
  }
}
