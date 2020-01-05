import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import { FormDialog } from "react-mst-form";

import Iconer from "../Iconer";

const schema = {
  type: "object",
  properties: {
    value: {
      type: "number",
      title: "Value (ether)",
      maximum: 80,
      minimum: 2
    },
    deposit: {
      type: "number",
      title: "Deposit (ether)",
      maximum: 80,
      minimum: 2
    },
    secret: {
      type: "string",
      title: "Secret",
      minLength: 3
    },
    fake: {
      type: "boolean",
      title: "is this fake bid?"
    }
  }
};

const config = {
  title: "Bid",
  cancel: "Cancel",
  submit: "Submit"
};

const snapshot = {};

const meta = {
  type: "object",
  properties: {
    value: {
      component: "range",
      step: 1,
      type: "number",
      icon: "money"
    },
    deposit: {
      component: "range",
      step: 1,
      type: "number",
      icon: "money"
    },
    secret: {
      type: "string",
      icon: "security"
    },
    fake: {
      type: "boolean"
    }
  },
  layout: ["value", "deposit", "secret", "fake"]
};

const iconer = new Iconer();

export class AuctionBid extends Component {
  render() {
    const { classes, open } = this.props;

    const { onCancel, onSubmit } = this.props;

    const events = {
      onCancel,
      onSubmit
    };

    const props = { config, schema, snapshot, meta, iconer };

    return (
      <React.Fragment>
        {open && (
          <FormDialog
            classes={{ paper: classes.form }}
            open={open}
            {...props}
            {...events}
          />
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(theme => ({
  form: {
    width: "80%"
  }
}))(AuctionBid);
