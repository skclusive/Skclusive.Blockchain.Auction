import React from "react";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import { Alert } from "reactstrap";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import PersonIcon from "@material-ui/icons/Person";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { withSnackbar } from "notistack";

import web3 from "../../shared/eth/web3";

import fetch from "../../utils/fetch";
import native from "../../utils/native";
import getBalance from "../../utils/balance";

import AccountStorage from "../states/Home/AccountStorage";

import Registration from "../../shared/contracts/Registration";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    textAlign: "left"
  },
  container: {
    marginTop: 25,
    textAlign: "center",
    flexWrap: "wrap"
  },
  button: {
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 250
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 250
  }
});

class Register extends React.Component {
  constructor(props) {
    super(props);
    const {
      uuid = localStorage.getItem("uuid") || this.makeUUID()
    } = this.props.match.params;
    this.state = {
      name: "",
      email: "",
      phone: "",
      uuid,
      college: "",
      isLoading: false,
      open: false,
      error: "",
      fields: {
        name: "",
        email: "",
        phone: "",
        college: ""
      },
      message: "",
      status: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.registration = Registration.create();
  }

  validateForm() {
    const { name, email, phone } = this.state;
    let fields = {
      name: "",
      email: "",
      phone: "",
      college: ""
    };

    let valid = true;
    let regex = /^[a-zA-Z0-9 ]*$/;
    if (!regex.test(name)) {
      fields["name"] = "Invalid name. Only alphanumeric characters accepted";
      valid = false;
    }
    regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email)) {
      fields["email"] = "Invalid email";
      valid = false;
    }
    regex = /^[0-9 ]*$/;
    if (!regex.test(phone)) {
      fields["phone"] = "Invalid phone number. Only numeric accepted";
      valid = false;
    }

    this.setState({
      fields
    });

    return valid;
  }

  handleChange = async event => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value
    });
  };

  checkMobileNumber = async event => {
    const { target } = event;
    const value = target.value;
    const { uuid } = this.state;
    const user = await this.registration.getUserByMobileNumber(value);
    let fields = {
      name: "",
      email: "",
      phone: "",
      college: ""
    };
    if (user && user["0"] && user["1"] && uuid !== user["1"]) {
      fields["phone"] = "Phone number already registered.";
      this.setState({ fields, disableSubmit: true });
      return false;
    } else {
      this.setState({ fields, disableSubmit: false });
    }
  };

  makeUUID() {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  async submitForm(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return false;
    }

    this.setState({ isLoading: true });
    const address = web3.eth.defaultAccount;
    const { phone, name, email, college, uuid } = this.state;

    const account = {
      phone,
      address,
      uuid,
      name,
      email,
      college
    };

    try {
      const response = await fetch.postJson(`/api/registration`, account);
      console.log("Account Registered");
      if (response.status == "OK") {
        this.setState({ message: response.message, status: response.status });
      } else {
        this.setState({
          message: response.message,
          status: response.status,
          isLoading: false
        });
      }
    } catch (err) {
      this.setState({ isLoading: false, error: true, open: true });
      console.log("Error is: " + err);
    }
  }

  componentDidMount() {
    if (AccountStorage.stored.uuid) {
      this.props.history.push("/");
      return;
    }
    const { enqueueSnackbar } = this.props;
    this.unsubscribe = this.registration.onUserRegistered(async response => {
      const account = {
        phone: response.mobileNumber,
        address: response.publicKey,
        uuid: response.uuid,
        name: response.name,
        email: response.email,
        college: response.college
      };
      const {uuid} = this.state;
      const ethAccount = JSON.parse(localStorage.getItem("__eth__account__"));
      if(uuid === account.uuid && ethAccount.address === account.address) {
        enqueueSnackbar(response.message);
        const balance = await getBalance();
        native("registration", { ...account, balance });
        localStorage.setItem("registered-account", JSON.stringify(account));
        AccountStorage.stored = account;
        this.props.history.push("/");
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const {
      name,
      email,
      phone,
      college,
      isLoading,
      fields,
      message,
      status,
      disableSubmit
    } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <h3>Registration</h3>
        <form onSubmit={e => this.submitForm(e)}>
          <div>
            <Grid container spacing={0}>
              <Grid item xs={12} style={{ padding: 5 }}>
                <FormControl className={classes.formControl}>
                  <TextField
                    error={fields.name != ""}
                    required
                    id="name"
                    name="name"
                    label="Name"
                    disabled={isLoading}
                    className={classNames(classes.margin, classes.textField)}
                    value={name}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                      shrink: "true"
                    }}
                    onInput={e => {
                      e.target.value = e.target.value.toString().slice(0, 50);
                    }}
                  />
                  {fields.name && (
                    <FormHelperText id="component-error-text" error>
                      {fields.name}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} style={{ padding: 1 }}>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    error={fields.email != ""}
                    id="email"
                    name="email"
                    label="Email"
                    disabled={isLoading}
                    className={classes.textField}
                    value={email}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                      shrink: "true"
                    }}
                    onInput={e => {
                      e.target.value = e.target.value.toString().slice(0, 50);
                    }}
                  />
                  {fields.email && (
                    <FormHelperText id="component-error-text" error>
                      {fields.email}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} style={{ padding: 1 }}>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    error={fields.phone != ""}
                    id="phone"
                    name="phone"
                    label="Phone"
                    disabled={isLoading}
                    className={classes.textField}
                    value={phone}
                    onChange={e => this.handleChange(e)}
                    onBlur={e => this.checkMobileNumber(e)}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                      shrink: "true"
                    }}
                    onInput={e => {
                      e.target.value = e.target.value.toString().slice(0, 10);
                    }}
                  />
                  {fields.phone && (
                    <FormHelperText id="component-error-text" error>
                      {fields.phone}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} style={{ padding: 1 }}>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    error={fields.college != ""}
                    id="college"
                    name="college"
                    label="College"
                    disabled={isLoading}
                    className={classes.textField}
                    value={college}
                    onChange={e => this.handleChange(e)}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon />
                        </InputAdornment>
                      ),
                      shrink: "true"
                    }}
                    onInput={e => {
                      e.target.value = e.target.value.toString().slice(0, 50);
                    }}
                  />
                  {fields.college && (
                    <FormHelperText id="component-error-text" error>
                      {fields.college}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading || disableSubmit}
                  className={classes.button}
                >
                  <PersonAddIcon className={classes.leftIcon} /> REGISTER
                </Button>
                {isLoading && <CircularProgress color="primary" />}
              </Grid>
              {message && status && (
                <Grid item xs={12}>
                  {status && status == "OK" ? (
                    <Alert color="success">{message}</Alert>
                  ) : status && status == "KO" ? (
                    <Alert color="danger">{message}</Alert>
                  ) : (
                    ""
                  )}
                </Grid>
              )}
            </Grid>
          </div>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(Register));
