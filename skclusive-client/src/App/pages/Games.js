import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PlayIcon from "@material-ui/icons/PlayCircleOutline";
import HelpIcon from "@material-ui/icons/HelpOutlined";
import TransactionIcon from "@material-ui/icons/ListOutlined";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  fab: {
    margin: theme.spacing.unit
  },
  button: {
    margin: 5,
    padding: 2
  },
  leftIcon: {
    marginRight: 5
  },
  container: {
    margin: 25,
    textAlign: "center",
    flexWrap: "wrap"
  },
  paper: {
    padding: 15,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class Games extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lottery: false,
      jumble: false,
      dice: false,
      auction: false,
      scroll: "paper"
    };
  }

  loadGame = url => {
    this.props.history.push(url);
  };

  handleOpen = game => () => {
    this.setState({
      [game]: true
    });
  };

  handleClose = game => () => {
    this.setState({
      [game]: false
    });
  };

  render() {
    const { classes } = this.props;
    const jumblepoints = [
      { points: 50, seconds: "0 - 10" },
      { points: 40, seconds: "11 - 20" },
      { points: 30, seconds: "21 - 40" },
      { points: 20, seconds: "41 - 60" },
      { points: 10, seconds: ">60" }
    ];

    return (
      <div className={classes.container}>
        <h3>Games</h3> <br />
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Typography variant="h5" component="h3">
                Auction
              </Typography>
              <img
                src="/img/auction.jpeg"
                style={{ width: "90%", height: "85px" }}
              />
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <Button
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                      this.loadGame("/games/auction");
                    }}
                  >
                    <PlayIcon className={classes.leftIcon} />
                    Play
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    color="secondary"
                    className={classes.button}
                    onClick={this.handleOpen("auction")}
                  >
                    <HelpIcon className={classes.leftIcon} />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
       </Grid>
        <Dialog
          open={this.state.auction}
          onClose={this.handleClose("auction")}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle>Auction Game</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText primary="1. Auctions are created by admin at regular intervals with time period for Bidding and Revealing" />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Auctions list page shows open and closed auctions" />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Any open auction can be opened and Bid can be submitted if Bid period is not over yet" />
              </ListItem>
              <ListItem>
                <ListItemText primary="4. You can submit multiple Bids (including actual and fake Bids)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="5. Bid requires value to be selected and higher amount to be deposited and a secret to hash the bid" />
              </ListItem>
              <ListItem>
                <ListItemText primary="6. Hashed Bids are shared with every Bidder of the auction" />
              </ListItem>
              <ListItem>
                <ListItemText primary="7. Bids can be revealed once Revealing is started. Bidders would be notified in advance" />
              </ListItem>
              <ListItem>
                <ListItemText primary="8. Revealing is mandatory to win the Auction if any of your Bid highest at that time" />
              </ListItem>
              {/* <ListItem>
                <ListItemText primary="9. All the Bids submitted for the auction has to be submitted for Revealing (including actual and fake)" />
              </ListItem> */}
              <ListItem>
                <ListItemText primary="9. Fake and lossing Bids deposits are returned only during Reveal" />
              </ListItem>
              <ListItem>
                <ListItemText primary="10. During revealing highest bidder can be replaced by new highest Bidder" />
              </ListItem>
              <ListItem>
                <ListItemText primary="11. If your highest Bid is replaced by other Bidder. you can withdraw your deposit" />
              </ListItem>
              <ListItem>
                <ListItemText primary="12. Auction is ended by the admin. The latest Highest Bidder is the Winner. Winner will be rewarded with '10' points" />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose("auction")} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
     </div>
    );
  }
}
export default withStyles(styles)(Games);
