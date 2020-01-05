// @ts-check

import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import browser from "browser-detect";

import auction from "./routes/auction";
import ether from "./routes/etherrequest";
import registration from "./routes/registration";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static(path.join(__dirname, "client")));

app.use("/api/auction", auction);
app.use("/api/ether", ether);
app.use("/api/registration", registration);

app.use("/download", (req, res) => {
  const useragent = req.headers["user-agent"];
  const client = browser(useragent);
  if (client.mobile && client.os) {
    if (client.os.toLowerCase().indexOf("os x") !== -1) {
      res.send(`
  <html>
    <body>
      <h1>
        Coming soon ! 
      </h1>
    </body>
  </html>`);
     // res.redirect("https://itunes.apple.com/in/app/facebook/id284882215");
    } else if (client.os.toLowerCase().indexOf("android") !== -1) {
      res.redirect(
        "https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en_US"
      );
    }
    return;
  }
  res.send(`
  <html>
    <body>
      <h1>
        Please use mobile browser from iPhone or Andriod
      </h1>
    </body>
  </html>`);
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

export default app;
