import React, { Component } from "react";

import classNames from "classnames";

import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";

import AccountIcon from "@material-ui/icons/AccountCircle";
import LocationIcon from "@material-ui/icons/MyLocation";
import DateIcon from "@material-ui/icons/DateRange";
import MoneyIcon from "@material-ui/icons/AttachMoney";

import web3 from "../../../../shared/eth/web3";

export class AuctionCard extends Component {
  render() {
    const { className: clazz, classes, style } = this.props;
    const className = classNames(classes.root, clazz);

    const { auction, children } = this.props;
    const {
      addrezz,
      name = "",
      description = "",
      image,
      biddingEnd,
      revealEnd,
      highestBidder,
      highestBid
    } = auction;

    const highestBidEther = web3.utils.fromWei(`${highestBid || 0}`, "ether");

    const biddingEnded = biddingEnd - Date.now() <= 0;

    return (
      <div {...{ className, style }}>
        <Card className={classes.card} square>
          <CardMedia className={classes.media} image={image} title={name} />
          <CardContent>
            <Grid item xs container direction="column" spacing={4}>
              <Grid item xs>
                <Typography variant="h4" className={classes.name}>
                  {`${name}`}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="caption" className={classes.description}>
                  {`${description}`}
                </Typography>
              </Grid>
              <Grid item xs>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={addrezz}
                      primaryTypographyProps={{
                        className: classes.hash
                      }}
                    />
                  </ListItem>

                  {biddingEnded && (
                    <>
                      <ListItem>
                        <ListItemIcon>
                          <AccountIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Highest Bidder is ${highestBidder}`}
                          primaryTypographyProps={{
                            className: classes.hash
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <MoneyIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Highest Bid is ${highestBidEther} ether`}
                          primaryTypographyProps={{
                            className: classes.hash
                          }}
                        />
                      </ListItem>
                    </>
                  )}

                  <ListItem>
                    <ListItemIcon>
                      <DateIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Bidding Ends by ${new Date(
                        parseInt(biddingEnd)
                      ).toLocaleString()}`}
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
                      primary={`Reveal Ends by ${new Date(
                        parseInt(revealEnd)
                      ).toLocaleString()}`}
                      primaryTypographyProps={{
                        className: classes.hash
                      }}
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </CardContent>
          {children}
        </Card>
      </div>
    );
  }
}

export default withStyles(theme => ({
  root: {
    height: "100%",
    width: "100%"
  },
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  name: {
    paddingBottom: 10
  },
  description: {
    fontSize: "1rem"
  },
  pos: {
    marginBottom: 12
  },
  media: {
    height: 140
  },
  hash: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}))(AuctionCard);
