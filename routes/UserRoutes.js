import express from "express"

import {createNewUser, getExistingUsers} from "../handlers/UserRoutesHandler"

const router = express.Router();

router.post("/newUser", createNewUser);

export default router