import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  fab: {
    margin: theme.spacing(1)
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
}));

export default function Help() {
    const classes = useStyles();
    return (
      <div className={classes.container}>
        <Typography variant="h5" component="h3">
          Auction Help
        </Typography>
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
      </div>
    );
  }
