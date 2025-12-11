import express from "express";
import { createItemPost, getItems,deletePost,updatePost} from "../handlers/ItemRoutesHandler.js";
import { authMiddleWare } from "../middleware/auth.js";

const router= express.Router();

router.post("/post-lost-item", authMiddleWare,createItemPost);
router.get("/retrieve-item-posts", getItems);
router.delete("/delete-item-post/:id", deletePost);
router.put("/update-item-post/:id", updatePost);
export default router