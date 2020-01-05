// @ts-check

import * as express from "express";
import RegistrationController from "../controllers/registration";

const router = express.Router();

router.post("", RegistrationController.registerUser);
router.get("/scores", RegistrationController.getScores);
router.post("/balance", RegistrationController.getUserBalanceAndScore);
router.get("/winners", RegistrationController.getWinners);

export default router;
