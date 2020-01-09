import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  TextField
} from "@material-ui/core";

import AccountStorage from "../../../states/Account/AccountStorage";

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = AccountStorage.stored;

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" noValidate>
        <CardHeader title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Name"
                margin="dense"
                name="firstName"
                value={user.name}
                readOnly
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                margin="dense"
                name="email"
                readOnly
                value={user.email}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Address"
                margin="dense"
                name="address"
                readOnly
                value={user.address}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                margin="dense"
                name="phone"
                type="number"
                readOnly
                value={user.phone}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="College"
                margin="dense"
                name="college"
                readOnly
                value={user.college}
              />
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </Card>
  );
};

export default AccountDetails;
