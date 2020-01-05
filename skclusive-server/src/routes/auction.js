// @ts-check

import * as express from "express";

import Controller from "../controllers/auction";

import { respond } from "../utils";

const router = express.Router();

router.post("/create", respond(req => Controller.create(req.body || {})));

router.post("/end", respond(req => Controller.end(req.body || {})));

export default router;
