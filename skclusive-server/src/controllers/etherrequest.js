// @ts-check

import EtherRequest from "../shared/contracts/EtherRequest";
import Registration from "../shared/contracts/Registration";

import web3 from "../shared/eth/web3";

const errorResponse = {
  message: "Technical problem, please try later",
  status: "KO",
  errorCode: "ETH-500"
};

const ethRequest = EtherRequest.create(web3);
const registration = Registration.create(web3);

const requestEther = async (req, res) => {
  try {
    const user = req.body;
    const alreadyClaimed = await registration.checkInitialCredit(user.uuid);
    if (!alreadyClaimed) {
      const isRequestPending = await ethRequest.checkRequestPending(
        user.address
      );
      if (isRequestPending) {
        res.status(200).json({
          status: "KO",
          message: "Previous claim request is in pending.",
          errorCode: "ETH-101"
        });
        return;
      }
      await ethRequest.requestEther(user.uuid);
      res.status(200).json({
        message: "Successfully requested",
        status: "OK",
        errorCode: "ETH-000"
      });
    } else {
      res.status(200).json({
        status: "KO",
        message: "User already claimed the balance",
        errorCode: "REG-100"
      });
    }
  } catch (err) {
    console.log("Error while requesting ether ", err);
    res.status(200).json(errorResponse);
  }
};

const getRequestedUsers = async (req, res) => {
  try {
    const users = await ethRequest.getUsers();

    const data = users.filter(user => user.uuid || user.phone);

    res.status(200).json({
      message: "Successfully requested",
      status: "OK",
      errorCode: "ETH-000",
      data
    });
  } catch (err) {
    console.log("Error while fetching requested users for ether ", err);
    res.status(200).json({
      status: "KO",
      message: err.message
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const user = req.body;
    const alreadyClaimed = await registration.checkInitialCredit(user.uuid);
    console.log("Already claimed --------------- ", alreadyClaimed);
    if (!alreadyClaimed) {
      await registration.web3.eth.sendTransaction({
        to: user.addrezz,
        gas: 4000000,
        gasPrice: 10000,
        value: registration.web3.utils.toWei("100", "ether")
      });
      console.log("Done calling sendtransaction ---------------->>>> ");
      const credited = await ethRequest.acceptRequest(user.addrezz, user.uuid);
      console.log("Calling credited ------------------- ", credited);
      res.status(200).json({
        status: "OK",
        message: "Ether credited"
      });
      return;
    } else {
      res.status(200).json({
        status: "KO",
        message: "User already claimed the balance",
        errorCode: "REG-100"
      });
    }
  } catch (err) {
    console.log("Error while transferring initial ether ---- >> ", err);
    res.status(500).json({
      status: "KO",
      message: "Technical problem, please try after sometime.",
      errorCode: "REG-500"
    });
  }
};

export default { requestEther, getRequestedUsers, acceptRequest };
