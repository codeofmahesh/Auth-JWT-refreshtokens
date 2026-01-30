import express from "express";
import { addUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

// Show all users
router.get('/', getUsers);

// Get one user
router.get('/:id', getUser);

// add user
router.post('/', addUser);

// update user
router.put('/:id', updateUser);

//Delete user
router.delete('/:id', deleteUser);


export default router;