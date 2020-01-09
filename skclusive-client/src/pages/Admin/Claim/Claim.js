import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";

import fetch from "../../../utils/fetch";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import Alert from "@material-ui/lab/Alert";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  button: {
    margin: theme.spacing(1)
  }
});

class Claim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayUsers: [],
      message: "",
      status: "",
      isLoading: false,
      acceptedIndexes: []
    };
  }

  async getUsers() {
    this.setState({ isLoading: true });
    const response = await fetch.getJson(`/api/ether/users`);
    if (response.status === "OK") {
      this.setState({
        users: response.data,
        displayUsers: response.data,
        isLoading: false
      });
    } else {
      if (response.message.toUpperCase().includes("ECONNREFUSED")) {
        this.setState({
          status: response.status,
          message: "Connection refused to geth.",
          isLoading: false
        });
      } else {
        this.setState({
          status: response.status,
          message: response.message,
          isLoading: false
        });
      }
    }
  }

  async componentDidMount() {
    await this.getUsers();
  }

  displayUsers(users) {
    const userData = users.map(user => {
      return Object.entries(user);
    });
    return userData;
  }

  acceptEther(user, index) {
    const data = {
      addrezz: user.addrezz,
      uuid: user.uuid
    };
    return async () => {
      this.setState({
        acceptedIndexes: [
          ...this.state.acceptedIndexes,
          { index, credited: false }
        ]
      });
      await fetch.postJson(`/api/ether/accpet/request`, data);
      this.setState({
        acceptedIndexes: [
          ...this.state.acceptedIndexes.slice(0, index - 1),
          { index, credited: true },
          ...this.state.acceptedIndexes.slice(index)
        ]
      });
    };
  }

  searchUser = name => event => {
    console.log("Claim change event value :: ", event.target.value);
    const value = event.target.value;
    if (value) {
      const displayUsers = this.state.users.filter(user => {
        let valueExists = false;
        Object.keys(user).forEach(key => {
          if (user[key].toLowerCase().includes(value.toLowerCase())) {
            valueExists = true;
          }
        });
        return valueExists;
      });
      this.setState({ displayUsers });
    } else {
      this.setState({ displayUsers: this.state.users });
    }
  };

  isAccepted(index) {
    return this.state.acceptedIndexes.find(element => {
      return element.index === index;
    })
      ? true
      : false;
  }

  isCredited(index) {
    return this.state.acceptedIndexes.find(element => {
      if (element.index === index) {
        return element.credited;
      }
      return false;
    })
      ? true
      : false;
  }

  render() {
    const {
      message,
      status,
      isLoading,
      displayUsers
    } = this.state;
    const { classes } = this.props;
    // console.log(users);
    return (
      <div>
        {status && status === "OK" ? (
          <Alert severity="success">{message}</Alert>
        ) : status && status === "KO" ? (
          <Alert severity="error">{message}</Alert>
        ) : (
          ""
        )}
        {isLoading ? (
          <Grid className="center">
            <div className="col-xs-1" align="center">
              <CircularProgress color="primary" size={200} />
            </div>
          </Grid>
        ) : (
          <div>
            <Grid>
              <form>
                <TextField
                  label="Claim Field"
                  type="Claim"
                  onChange={this.searchUser()}
                />
              </form>
            </Grid>
            <Grid>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Mobile Number</TableCell>
                      <TableCell>Claim Ether</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayUsers &&
                      displayUsers.map((row, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>
                              {this.isAccepted(index + 1) ? (
                                this.isCredited(index + 1) ? (
                                  <p>Credited</p>
                                ) : (
                                  <CircularProgress />
                                )
                              ) : (
                                <Button
                                  variant="contained"
                                  color="primary"
                                  disabled={this.isAccepted(index + 1)}
                                  className={classes.button}
                                  onClick={this.acceptEther(row, index + 1)}
                                >
                                  Accept Ether
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(Claim);
