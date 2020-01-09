import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

import { FormDialog } from "react-mst-form";

const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Name",
      minLength: 3
    },
    description: {
      type: "string",
      title: "Description",
      minLength: 10
    },
    image: {
      type: "string",
      title: "Image",
      format: "url",
      minLength: 10
    },
    biding: {
      type: "number",
      title: "Biding (mins)",
      maximum: 60,
      minimum: 1
    },
    reveal: {
      type: "number",
      title: "Reveal (mins)",
      maximum: 60,
      minimum: 1
    }
  }
};

const config = {
  title: "Auction",
  cancel: "Cancel",
  submit: "Create"
};

const snapshot = {};

const meta = {
  type: "object",
  properties: {
    name: {
      type: "string"
    },
    description: {
      type: "string"
    },
    image: {
      type: "string"
    },
    biding: {
      component: "range",
      step: 1,
      type: "number"
    },
    reveal: {
      component: "range",
      step: 1,
      type: "number"
    }
  },
  layout: ["name", "description", "image", "biding", "reveal"]
};

export class AuctionDialog extends Component {
  render() {
    const { classes, open } = this.props;

    const events = {
      onCancel: this.props.onCancel,
      onSubmit: this.onSubmit
    };

    const props = { config, schema, snapshot, meta };

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

  onSubmit = values => {
    const { biding, reveal, ...others } = values;
    const auction = { ...others, biding: biding * 60, reveal: reveal * 60 };
    this.props.onSubmit(auction);
  };
}

export default withStyles(theme => ({
  form: {
    width: "80%"
  }
}))(AuctionDialog);
