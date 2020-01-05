import React from "react";
import fetch from "../../utils/fetch";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withSnackbar } from "notistack";
import withStyles from "@material-ui/core/styles/withStyles"; 
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  hash: {
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  paper: {
    margin: 5,
    padding: 2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }
});

class LeaderBoard extends React.Component {
  state = {
    users: []
  };

  componentDidMount = async () => {
    this.loadUsers();
    this.leaderBoardInterval = setInterval(this.loadUsers, 60000);
  };

  componentWillUnmount() {
    if (this.leaderBoardInterval) {
      clearInterval(this.leaderBoardInterval);
    }
  }

  loadUsers = async () => {
    const response = await fetch.getJson(`/api/registration/scores`);
    if (response.status == "OK") {
      this.setState({
        users: response.data,
      });
    } else {
      if (response.message.toUpperCase().includes("ECONNREFUSED")) {
        this.handleClickVariant('error', `Connection refused to geth`);       
      } else {
        this.handleClickVariant('error', response.message);       
      }
    }
  };

  render() {
    const { users } = this.state;
    const { classes } = this.props;
    return (
        <div>          
            <List>
              {this.state.users.length == 0 && (
                <ListItem>
                  <ListItemText primary="No one joined" />
                </ListItem>
              )}
              {this.state.users.map((user, index) =>
                <Paper className={classes.paper} key={index}>
                <ListItem key={index} >
                  <ListItemText primary={index+1 +' . '+ user.name + " - "+ user.points} 
                  secondary={ <Link to= {{ pathname: `/games/transactions/${ user.publicKey}` }} > {user.publicKey} </Link> }
                  secondaryTypographyProps={{
                    className: classes.hash
                  }}
                  />
                </ListItem></Paper>
              )}
            </List>
        </div>
    );
  }
}

export default withStyles(styles)(withSnackbar(LeaderBoard));
