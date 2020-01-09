import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "fit-content"
  },
  avatar: {
    width: 60,
    height: 60,
    textDecoration: "none",
    color: "#fff",
    backgroundColor: green[500]
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = {
    name: "Shen Zhi",
    address: "Brain Director"
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        to="/settings"
      >
        {user.name[0]}
      </Avatar>
      <Typography className={classes.name} variant="h4">
        {user.name}
      </Typography>
      <Typography variant="body2">{user.address}</Typography>
    </div>
  );
};

export default Profile;
