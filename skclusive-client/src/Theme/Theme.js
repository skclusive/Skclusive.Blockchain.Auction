import * as React from "react";

import { create as createJSS } from "jss";

import presetJSS from "jss-preset-default";

import ThemeProvider from "@material-ui/styles/ThemeProvider";

import createTheme from "@material-ui/core/styles/createMuiTheme";

import CssBaseline from "@material-ui/core/CssBaseline";

import { StylesProvider, createGenerateClassName } from "@material-ui/styles";

import red from "@material-ui/core/colors/red";

// Create a JSS instance with the default preset of plugins.
// It's optional.

const jss = createJSS(presetJSS());

const generateClassName = createGenerateClassName();

export default function Theme(props) {
  const { children, theme } = props;
  return (
    <StylesProvider jss={jss} generateClassName={generateClassName}>
      <ThemeProvider theme={getTheme(theme)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StylesProvider>
  );

  // tslint:disable-next-line:no-shadowed-variable
  function getTheme(theme) {
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
      }
    });
  }
}
