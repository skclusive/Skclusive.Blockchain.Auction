import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, Avatar, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { green } from "@material-ui/core/colors";

import AccountStorage from "../../../states/Account/AccountStorage";

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: "flex"
  },
  avatar: {
    width: 40,
    height: 40,
    textDecoration: "none",
    color: "#fff",
    backgroundColor: green[500]
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  }
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = AccountStorage.stored;

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <div className={classes.details}>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <Avatar className={classes.avatar}>{user.name[0]}</Avatar>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h4">
                {user.name}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountProfile;
