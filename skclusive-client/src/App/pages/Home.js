import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';

import { Container, Col, FormGroup, Label, Input, Alert } from "reactstrap";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import MoneyIcon from '@material-ui/icons/AttachMoney';

import web3 from "../../shared/eth/web3";

import getBalance from "../../utils/balance";

import fetch from "../../utils/fetch";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: 'left'
  },
  container: {
    marginTop: 25,
    textAlign: 'center',
    flexWrap: 'wrap'
  },
  button: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 250,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
      <Container className="Home">
        <React.Fragment>
            <h2>Dashboard</h2>
            <Col>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  readOnly
                  value={web3.eth.defaultAccount}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Balance (Ether)</Label>
                <Input
                  type="text"
                  name="balance"
                  id="balance"
                  readOnly
                  value={balance}
                />
              </FormGroup>
            </Col>
            <Col>
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
            </Col>
            <Col style={{ marginTop: "10px" }}>
              {claimStatus ? (
                <Alert color="success">
                  Request sent - Please visit Organizer stall to claim Ether
                </Alert>
              ) : (
                error && (
                  <Alert color="danger">
                    {message}
                  </Alert>
                )
              )}
            </Col>
          </React.Fragment>
      </Container>
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