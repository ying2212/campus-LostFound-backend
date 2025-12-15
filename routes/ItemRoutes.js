import express from "express";
import { createItemPost, getItems,deletePost,updatePost} from "../handlers/ItemRoutesHandler.js";
import { authMiddleWare } from "../middleware/auth.js";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router= express.Router();

router.post(
    '/post-lost-item',authMiddleWare,
    upload.single('image'),//image upload
    createItemPost
);  
router.get("/retrieve-item-posts", getItems);
router.delete("/delete-item-post/:id", deletePost);
router.put("/update-item-post/:id", updatePost);
export default router