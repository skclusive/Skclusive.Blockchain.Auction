// @ts-check

import Registration from "../shared/contracts/Registration";

import web3 from "../shared/eth/web3";

const errorResponse = {
  status: "KO",
  message: "Technical problem, please try after sometime.",
  errorCode: "REG-500"
};

const registration = Registration.create(web3);

const registerUser = async (req, res) => {
  try {
    const user = req.body;
    var amount = 100000;
    const accountdata = await registration.getUserByUUID(user.uuid);
    console.log('User Data from the input ---- ', user);
    if (accountdata["2"] == 2) {
      res.status(200).json({
        message: "Exceeded chances to create account",
        status: "KO",
        errorCode: "REG-001"
      });
    } else {
      const mobileNumberUsed = await registration.checkUserByMobile(user.phone);
      if (!mobileNumberUsed) {
        const accountCreated = registration.registerUser(
          user.phone,
          user.address,
          user.uuid,
          user.name,
          user.email,
          user.college
        );
        res.status(200).json({
          message: "Registration in progress...",
          status: "OK",
          errorCode: "000"
        });
      } else {
        res.status(200).json({
          message: "Mobile number already used!!",
          status: "KO",
          errorCode: "101"
        });
      }
    }
    return;
  } catch (err) {
    console.log("Registration error ---- ", err);
    res.status(500).json(errorResponse);
  }
};

const getUserBalanceAndScore = async (req, res) => {
  try {
    const user = req.body;
    let balanceInWei = await web3.eth.getBalance(user.address);
    let balance = web3.utils.fromWei(balanceInWei, 'ether');
    let response = await registration.getUserPoints(user.address);
    res.status(200).json({
      message: "Successfully received data",
      status: "OK",
      errorCode: "000",
      data: { balance, points: response['poinnts'] }
    })
  } catch (err) {
    console.log("Error while getting balance ----- >> ", err);
    res.status(500).json(errorResponse);
  }

}

const getScores = async (req, res) => {
  try {
    const scoreCount = await registration.getScoresCount();
    console.log('Score count ------------- ', scoreCount);
    let scores = [];
    let score;
    for(let i = 0; i < scoreCount; i++) {
      score = await registration.scores(i);
      console.log("Score from index ::: ", score);
      scores.push(score);
    }
    scores.sort((a, b) => {
      return b.points - a.points;
    });
    res.status(200).json({
      message: "Successfully received data",
      status: "OK",
      errorCode: "000",
      data: scores
    })
  } catch (err) {
    console.log("Error while getting scores ----- >> ", err);
    res.status(500).json(errorResponse);
  }
}

const getWinners = async (req, res) => {
  try {
    const day = await registration.day();
    const winners = [];
    let winner;
    if(day > 0) {
      for(let i = 0; i < day; i++) {
        winner = await registration.winners(i);
        winners.push(winner);
      }
    }
    res.status(200).json({
      status: 'OK',
      message: 'Winners fetched successfully',
      data: winners
    });
  } catch(err) {
    console.log("Error while fetching winners :: ", err);
    res.status(500).json(errorResponse);
  }
}


export default { registerUser, getScores, getWinners, getUserBalanceAndScore };
