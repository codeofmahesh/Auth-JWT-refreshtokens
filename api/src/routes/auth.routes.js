import express from "express"
import { logout, refresh, registerUser, userLogin } from "../controllers/auth.controller.js";

const router = express.Router();

//userlogin
router.post('/login', userLogin);

//register user
router.post('/register', registerUser);

//refresh token
router.get('/refresh', refresh);

//logout
router.post('/logout', logout);

export default router;