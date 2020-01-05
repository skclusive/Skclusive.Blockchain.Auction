import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import { FormDialog } from "react-mst-form";

import Iconer from "../Iconer";

const schema = {
  type: "object",
  properties: {
    bids: {
      type: "array",
      title: "bids",
      items: {
        type: "object",
        properties: {
          value: {
            type: "number",
            title: "Value (ether)",
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
      }
    }
  }
};

const config = {
  title: "Reveal",
  cancel: "Cancel",
  submit: "Submit"
};

const meta = {
  type: "object",
  properties: {
    bids: {
      type: "array",
      items: {
        type: "object",
        properties: {
          value: {
            component: "range",
            step: 1,
            type: "number"
          },
          secret: {
            type: "string",
            icon: "security",
            minLength: 3
          },
          fake: {
            type: "boolean"
          }
        },
        layout: ["value", "secret", "fake"]
      }
    }
  },
  layout: ["bids"]
};

const iconer = new Iconer();

export class AuctionReveal extends Component {
  render() {
    const { classes, open, bids = [] } = this.props;

    const snapshot = {
      bids
    };

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
}))(AuctionReveal);
