import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import AccountStorage from "../../states/Account/AccountStorage";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    padding: 15
  }
}));

export default function Settings(props) {
  const classes = useStyles();
  return (
    <Grid container spacing={4} className={clsx(classes.root, props.className)}>
      <Grid>
        <Typography variant="h4">
          Current Account can be erased locally clicking below button.
        </Typography>
      </Grid>
      <Grid>
        <Button
          onClick={() => {
            AccountStorage.clear();
            props.history.replace(`/`);
          }}
          variant="contained"
        >
          Clear Account
        </Button>
      </Grid>
    </Grid>
  );
}
