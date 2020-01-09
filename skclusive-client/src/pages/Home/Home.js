import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import Alert from "@material-ui/lab/Alert";

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MoneyIcon from '@material-ui/icons/AttachMoney';

import web3 from "../../shared/eth/web3";

import getBalance from "../../utils/balance";

import fetch from "../../utils/fetch";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    textAlign: 'left'
  },
  container: {
    marginTop: 25,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 250
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: "0",
      claimStatus: false,
      error: false,
      isLoading: false
    };
  }

  async componentDidMount() {
    this.loadBalance(false);
  }

  render() {
    const { balance, isLoading, claimStatus, error, message } = this.state;
    const { classes } = this.props;
    return (
      <Grid className={classes.root}>
            <h2>Account Balance</h2>
            <Grid>
                <TextField
                  type="text"
                  label="Address"
                  name="address"
                  id="address"
                  margin="normal"
                  fullWidth
                  readOnly
                  value={web3.eth.defaultAccount}
                />
            </Grid>
            <Grid>
                <TextField
                  type="text"
                  label="Balance (Ether)"
                  name="balance"
                  id="balance"
                  margin="normal"
                  fullWidth
                  readOnly
                  value={balance}
                />
            </Grid>
            <Grid>
              <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={balance > 5 || isLoading}
                  className={classes.button}
                  onClick={() => this.onClaim()}>
                  <MoneyIcon className={classes.leftIcon} /> CLAIM
                </Button>
              {isLoading && 
                <CircularProgress color="primary" />}
            </Grid>
            <Grid style={{ marginTop: "10px" }}>
              {claimStatus ? (
                <Alert severity="success">
                  Request sent - Please visit Organizer stall to claim Ether
                </Alert>
              ) : (
                error && (
                  <Alert severity="error">
                    {message}
                  </Alert>
                )
              )}
            </Grid>
      </Grid>
    );
  }

  onClaim = async event => {
    try {
      this.setState({ isLoading: true });
      const user = JSON.parse(localStorage.getItem("registered-account"));
      const response = await fetch.postJson("/api/ether/request", user);
      if(response.status === 'KO') {
        this.setState({claimStatus: false, isLoading: false, message: response.message, error: true});
        return;
      }
      this.loadBalance(true);
    } catch (err) {
      this.setState({ error: true, isLoading: false, message: err.message });
    }
  };

  async loadBalance(status) {
    const balance = await getBalance();
    this.setState({ balance: balance, claimStatus: status, isLoading: false });
  }
}

export default withStyles(styles)(Home);