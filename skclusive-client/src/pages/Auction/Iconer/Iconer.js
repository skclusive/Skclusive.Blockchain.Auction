import * as React from "react";

import AccountBalance from "@material-ui/icons/AccountBalanceSharp";
import Assignment from "@material-ui/icons/AssignmentSharp";
import Build from "@material-ui/icons/BuildSharp";
import DateRange from "@material-ui/icons/DateRangeSharp";
import Face from "@material-ui/icons/FaceSharp";
import Money from "@material-ui/icons/AttachMoney";
import Security from "@material-ui/icons/Security";

export default class IconRenderer {
  static icons = {
    "account-balance": <AccountBalance />,
    assignment: <Assignment />,
    build: <Build />,
    "date-range": <DateRange />,
    face: <Face />,
    money: <Money />,
    security: <Security />
  };

  render(icon) {
    return IconRenderer.icons[icon] || icon;
  }
}
