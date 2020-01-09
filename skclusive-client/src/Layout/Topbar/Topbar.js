import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: "none"
  },
  flexGrow: {
    flexGrow: 1
  },
  link: {
    color: "inherit",
    textDecoration: "none"
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className, children, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)}>
      <Toolbar>
        <RouterLink to="/" className={classes.link}>
          <Typography className={classes.title} variant="h6" noWrap>
            Blockchain Auction
          </Typography>
        </RouterLink>
        <div className={classes.flexGrow} />
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
