import express from "express";
import { createItemPost, getItems} from "../handlers/ItemRoutesHandler.js";
import { authMiddleWare } from "../middleware/auth.js";

const router= express.Router();

router.post("/post-lost-item", authMiddleWare,createItemPost);
router.get("/retrieve-item-posts", getItems);

export default router