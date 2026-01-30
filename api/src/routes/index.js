import express from "express";
import userRoutes from './user.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

// Mount auth routes at /auth
router.use('/auth', authRoutes);

// Mount user routes at /user
router.use('/users', userRoutes);

export default router;