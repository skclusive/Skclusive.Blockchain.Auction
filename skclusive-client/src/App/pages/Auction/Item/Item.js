import React, { Component } from "react";

import classNames from "classnames";

import { withSnackbar } from "notistack";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import AccountIcon from "@material-ui/icons/AccountCircle";
import SecurityIcon from "@material-ui/icons/Security";
import DateIcon from "@material-ui/icons/DateRange";

import AuctionCard from "./Card";

import Auction from "../../../../shared/contracts/Auction";

import groupby from "../../../../utils/groupby";

import mutator from "../../../../utils/mutator";

import timeout from "../../../../utils/timeout";

import BidStorage from "../../../states/Auction/BidStorage";

import BidForm from "../Bid";

import RevealForm from "../Reveal";

export class AuctionItem extends Component {
  constructor(props) {
    super(props);
    const { addrezz } = this.props.match.params;
    this.state = { addrezz, bid: false, reveal: false, hack: 1 };
    this.auction = Auction.at(addrezz);
    this.subscriptions = [];
  }

  render() {
    const { className: clazz, classes, style } = this.props;
    const className = classNames(classes.root, clazz);

    const {
      error,
      bid: bopen,
      reveal: ropen,
      mybids = [],
      bids = [],
      ...auction
    } = this.state;

    const bidEvents = {
      onCancel: this.onBidCancel,
      onSubmit: this.onBidSubmit
    };

    const revealEvents = {
      onCancel: this.onRevealCancel,
      onSubmit: this.onRevealSubmit
    };

    const { hasEnded, hasReturns } = auction;

    const biddingEnded = auction.biddingEnd - Date.now() <= 0;
    const revealEnded = auction.revealEnd - Date.now() <= 0;

    return (
      <div {...{ className, style }}>
        <Grid container direction="column" wrap="nowrap">
          <Grid item>
            <AuctionCard auction={auction}>
              <CardActions className={classes.actions}>
                <Button
                  // size="small"
                  variant="raised"
                  color="primary"
                  disabled={hasEnded || biddingEnded}
                  onClick={this.onBid}
                >
                  Bid
                </Button>
                <Button
                  // size="small"
                  variant="raised"
                  color="primary"
                  disabled={!biddingEnded || revealEnded}
                  onClick={this.onReveal}
                >
                  Reveal
                </Button>
                <Button
                  // size="small"
                  variant="raised"
                  color="primary"
                  disabled={!hasReturns}
                  onClick={this.onWithdraw}
                >
                  Withdraw
                </Button>
              </CardActions>
            </AuctionCard>
          </Grid>
          {bids.length ? (
            <Grid item style={{ marginTop: 20 }}>
              <Typography variant="h5" className={classes.title}>
                {`Bids (${bids.length})`}
              </Typography>
              <Card square>
                <CardContent>
                  <List>
                    {bids.map((bid, index) => (
                      <ListItem
                        key={index}
                        alignItems="flex-start"
                        className={classes.item}
                      >
                        <List
                          className={classes.bid}
                          // subheader={<ListSubheader>{index + 1}</ListSubheader>}
                        >
                          <ListItem>
                            <ListItemIcon>
                              <AccountIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={bid.bidder}
                              primaryTypographyProps={{
                                className: classes.hash
                              }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <SecurityIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={bid.blindedBid}
                              primaryTypographyProps={{
                                className: classes.hash
                              }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <DateIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={new Date(
                                parseInt(bid.time)
                              ).toLocaleString()}
                              primaryTypographyProps={{
                                className: classes.hash
                              }}
                            />
                          </ListItem>
                        </List>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {error && (
            <Grid item>
              <Typography variant="subtitle1">{error}</Typography>
            </Grid>
          )}
          {bopen && <BidForm open={bopen} {...bidEvents} />}
          {ropen && <RevealForm open={ropen} bids={mybids} {...revealEvents} />}
        </Grid>
      </div>
    );
  }

  componentWillUnmount() {
    for (const subscription of this.subscriptions) {
      subscription();
    }
    this.subscriptions.length = 0;
  }

  onReveal = () => {
    this.setState(() => ({
      reveal: true
    }));
  };

  onRevealCancel = () => {
    this.setState(() => ({
      reveal: false
    }));
  };

  onRevealSubmit = async ({ bids: mybids }) => {
    this.setState(() => ({
      reveal: false,
      mybids
    }));

    const web3 = this.auction.web3;
    const [values, fakes, secrets] = mybids.reduce(
      ([values, fakes, secrets], mybid) => {
        return [
          [...values, this.auction.web3.utils.toWei(`${mybid.value}`, "ether")],
          [...fakes, mybid.fake],
          [...secrets, web3.utils.asciiToHex(mybid.secret)]
        ];
      },
      [[], [], []]
    );
    const { enqueueSnackbar } = this.props;
    try {
      enqueueSnackbar("Your Reveal is submitted for processing.", {
        variant: "info"
      });
      await this.auction.reveal(values, fakes, secrets);
      await this.loadAuction();
    } catch (ex) {
      enqueueSnackbar(`Error occured during Reveal submission. ${ex.message}`, {
        variant: "error"
      });
    }
  };

  onWithdraw = async () => {
    await this.auction.withdraw();
    await this.loadAuction();
  };

  onBid = () => {
    this.setState(() => ({
      bid: true
    }));
  };

  onBidCancel = () => {
    this.setState(() => ({
      bid: false
    }));
  };

  onBidSubmit = async bid => {
    this.setState(() => ({
      bid: false
    }));
    const value = this.auction.web3.utils.toWei(`${bid.value}`, "ether");
    const deposit = this.auction.web3.utils.toWei(`${bid.deposit}`, "ether");

    const { enqueueSnackbar } = this.props;
    try {
      enqueueSnackbar("Your Bid is submitted for processing.", {
        variant: "info"
      });
      await this.auction.doBid(value, bid.fake, bid.secret, deposit);
      BidStorage.addBid(this.state.addrezz, bid);
      const mybids = BidStorage.getBids(this.state.addrezz);
      this.setState(() => ({ mybids }));
    } catch (ex) {
      enqueueSnackbar(`Error occured during Bid submission ${ex.message}`, {
        variant: "error"
      });
    }
  };

  async loadAuction() {
    // const xstate = await this.auction.getState();
    // const bids = await this.auction.getAllBids();
    const [state, bids] = await Promise.all([
      this.auction.getState(),
      this.auction.getAllBids()
    ]);
    const mybids = BidStorage.getBids(this.state.addrezz);
    // const state = await this.auction.getStateWithBids();
    // const account = AccountStorage.stored;
    // const { bids, ...other } = state;
    // bids
    //   .filter(bid => bid.bidder === account.addrezz)
    //   .forEach((bid, index) => {
    //     bid.mine = mybids[index];
    //   });
    const xstate = { ...state, bids, mybids };
    this.setState(() => xstate);
    console.log(xstate);
  }

  async componentDidMount() {
    try {
      await this.loadAuction();
      this.listen();
    } catch (e) {
      const error = e.message;
      this.setState(() => ({ error }));
      console.error(e);
    }
  }

  listen() {
    const { enqueueSnackbar } = this.props;

    this.subscriptions.push(
      this.auction.onBidAdded(bid => {
        enqueueSnackbar(`New bid added by ${bid.bidder}`, {
          variant: "info"
        });
        this.setState(
          mutator(state => {
            state.bids.push(bid);
          })
        );
      })
    );

    this.subscriptions.push(
      this.auction.onAuctionEnded(auction => {
        enqueueSnackbar(`Auction "${this.state.name}" ended`, {
          variant: "info"
        });
        this.setState(
          mutator(state => {
            Object.assign(state, auction);
          })
        );
      })
    );

    this.subscriptions.push(
      this.auction.onHighestBidding(auction => {
        enqueueSnackbar(
          `Highest Bid ${this.auction.web3.utils.fromWei(
            auction.highestBid,
            "ether"
          )} Ether by ${auction.highestBidder}`,
          {
            variant: "info"
          }
        );
        this.setState(
          mutator(state => {
            Object.assign(state, auction);
          })
        );
      })
    );

    const biddingEnded = this.state.biddingEnd - Date.now();

    if (biddingEnded > 0) {
      this.subscriptions.push(
        timeout(() => {
          this.setState(
            mutator(state => {
              state.hack++;
            })
          );
        }, biddingEnded)
      );
    }

    const revealEnded = this.state.revealEnd - Date.now();

    if (revealEnded > 0) {
      this.subscriptions.push(
        timeout(() => {
          this.setState(
            mutator(state => {
              state.hack++;
            })
          );
        }, revealEnded)
      );
    }
  }

  getGrouped(bids) {
    return groupby(bids, bid => bid.bidder, bid => bid);
  }
}

export default withStyles(theme => ({
  root: {
    height: "100%",
    padding: 20
  },
  actions: {
    justifyContent: "space-around"
  },
  hash: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  item: {
    paddingLeft: 0,
    paddingRight: 0
  },
  bid: {
    width: "100%"
  }
}))(withSnackbar(AuctionItem));
