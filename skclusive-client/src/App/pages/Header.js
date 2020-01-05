import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";

import Auction from "./admin/Auction";

class Header extends Component {
  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">Skclusive-Auction</NavbarBrand>
          <Auction />
        </Navbar>
      </div>
    );
  }
}
export default Header;
