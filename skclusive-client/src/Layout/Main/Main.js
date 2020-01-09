import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";

import { Hidden, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import Sidebar from "./Sidebar";
import Topbar from "../Topbar";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: "100%"
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={handleSidebarOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Topbar>
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? "persistent" : "temporary"}
      />
      <main className={classes.content}>{children}</main>
    </div>
  );
};

export default Main;
