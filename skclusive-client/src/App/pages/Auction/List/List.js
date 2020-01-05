import React, { Component } from "react";

import classNames from "classnames";

import { withSnackbar } from "notistack";

import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import Timer from "../Timer";

import Auctions from "../../../../shared/contracts/Auctions";

import mutator from "../../../../utils/mutator";

export class AuctionList extends Component {
  constructor(props) {
    super(props);
    this.state = { auctions: [], error: "", tab: "open" };
    this.auctions = Auctions.create();
    this.subscriptions = [];
  }

  render() {
    const { className: clazz, classes, style } = this.props;
    const className = classNames(classes.root, clazz);

    const { auctions, error, tab } = this.state;
    return (
      <div {...{ className, style }}>
        <Typography variant="h5" className={classes.title}>
          Auctions
        </Typography>
        <Tabs
          className={classes.tabs}
          fullWidth
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          <Tab value="open" label="Open" />
          <Tab value="closed" label="Closed" />
        </Tabs>
        <List>
          {auctions
            .filter(({ hasEnded }) => (tab === "open" ? !hasEnded : hasEnded))
            .map((auction, index) => (
              <ListItem
                key={index}
                button
                alignItems="flex-start"
                onClick={this.onClick(auction.addrezz)}
              >
                <ListItemAvatar>
                  <Avatar
                    className={classes.avatar}
                    alt={auction.name}
                    src={auction.image}
                  />
                </ListItemAvatar>
                <ListItemText
                  className={classes.itemText}
                  primary={auction.name}
                  primaryTypographyProps={{ variant: "h6" }}
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        className={classes.inline}
                        color="textPrimary"
                      >
                        {auction.description}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  <Timer time={auction.biddingEnd} />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
        {error && <Typography variant="h5">{error}</Typography>}
      </div>
    );
  }

  handleChange = (event, value) => {
    console.log(event.currentTarget);
    this.setState(() => ({ tab: value }));
  };

  async loadAuctions() {
    const auctions = await this.auctions.getAuctionStates();
    this.setState(state => ({ auctions }));
  }

  componentWillUnmount() {
    for (const subscription of this.subscriptions) {
      subscription();
    }
    this.subscriptions.length = 0;
  }

  async componentDidMount() {
    try {
      await this.loadAuctions();
      this.listen();
    } catch (e) {
      const error = e.message;
      this.setState(state => ({ error }));
    }
  }

  listen() {
    const { enqueueSnackbar } = this.props;

    this.subscriptions.push(
      this.auctions.onAuctionCreated(auction => {
        enqueueSnackbar(`New auction "${auction.name}" created`, {
          variant: "info"
        });
        this.setState(
          mutator(state => {
            state.auctions.push(auction);
          })
        );
      })
    );

    this.subscriptions.push(
      this.auctions.onAuctionEnded(auction => {
        enqueueSnackbar(`Auction "${auction.name}" ended`, {
          variant: "info"
        });
        this.setState(
          mutator(state => {
            const _auction = state.auctions.find(
              item => item.addrezz === auction.addrezz
            );
            if (_auction) {
              Object.assign(_auction, auction);
            }
          })
        );
      })
    );
  }

  onClick(auction) {
    return event => {
      this.props.history.push(`/games/auction/${auction}`);
    };
  }
}

export default withStyles(theme => ({
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 0
  },
  root: {
    height: "100%",
    padding: 20
  },
  itemText: {
    paddingTop: 10
  },
  inline: {
    display: "inline"
  },
  tabs: {
    "& button:focus": {
      outline: "none !important"
    }
  },
  title: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10
  }
}))(withSnackbar(AuctionList));
