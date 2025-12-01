import express from "express";
import { createItemPost, getItemPost} from "../handlers/ItemRoutesHandler"
import { authMiddleWare } from "../middleware/auth";

const router= express.Router();

router.post("/post-lost-item", authMiddleWare,createItemPost);
router.get("/retrieve-item-posts", getItemPost);

export default router