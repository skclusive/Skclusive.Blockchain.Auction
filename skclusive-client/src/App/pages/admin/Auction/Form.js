import React, { Component } from "react";

import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

import AuctionDialog from "./Dialog";

import Button from "@material-ui/core/Button";

import fetch from "../../../../utils/fetch";

export class AuctionForm extends Component {
  state = { auction: false };

  render() {
    const { auction: open } = this.state;

    const events = {
      onCancel: this.onAuctionCancel,
      onSubmit: this.onAuctionSubmit
    };

    return (
      <React.Fragment>
        <li className="nav-item">
          <Button
            disabled={open}
            onClick={this.onAuction}
          >
            Create Auction
          </Button>
        </li>
        <li className="nav-item">
          <Button onClick={this.onEndAuction}>
            End Auction
          </Button>
        </li>
        {open && <AuctionDialog open={open} {...events} />}
      </React.Fragment>
    );
  }

  onEndAuction = async () => {
    const address = prompt("Enter the auction address");

    await fetch.postJson("/api/auction/end", { address });

    alert(`Auction ended at ${address}`);
  };

  onAuction = () => {
    this.setState(() => ({
      auction: true
    }));
  };

  onAuctionCancel = () => {
    this.setState(() => ({
      auction: false
    }));
  };

  onAuctionSubmit = async auction => {
    this.setState(() => ({
      auction: false
    }));

    console.log(`auction`, auction);

    const addrezz = await fetch.postJson("/api/auction/create", auction);

    alert(`Auction created at ${addrezz}`);
  };
}

export default withStyles(theme => ({
  form: {
    width: "80%"
  }
}))(AuctionForm);
