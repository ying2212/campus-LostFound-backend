import express from "express";
import { createItemPost, getItems,deletePost,updatePost} from "../handlers/ItemRoutesHandler.js";
import { uploadImage } from "../middleware/amazonS3.js";
import { authMiddleWare } from "../middleware/auth.js";
import multer from 'multer';

const router= express.Router();

router.post(
    '/post-lost-item',authMiddleWare,
    uploadImage.single('image'),//image upload
    createItemPost
);  
router.get("/retrieve-item-posts", getItems);
router.delete("/delete-item-post/:id", deletePost);
router.put('/claim/:id', authMiddleWare, updatePost);
export default router