// @ts-check

import * as express from "express";
import EtherRequestController from "../controllers/etherrequest";

const router = express.Router();

router.post("/request", EtherRequestController.requestEther);
router.get("/users", EtherRequestController.getRequestedUsers);
router.post("/accpet/request", EtherRequestController.acceptRequest);

export default router;
