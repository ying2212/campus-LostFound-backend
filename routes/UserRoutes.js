import express from "express";
import { 
    registerUser, 
    loginUser, 
    getCurrentUser, 
    resendVerification
} from "../handlers/UserRoutesHandler.js";
import { authMiddleWare } from "../middleware/auth.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleWare, getCurrentUser);
router.post("/resend-verification", resendVerification);

export default router;