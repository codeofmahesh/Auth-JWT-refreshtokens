import poolPromise from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { generateAccessToken, generateRefreshToken, revokeRefreshToken, saveRefreshToken, verifyRefreshToken } from '../services/tokenService.js';

// Login
export async function userLogin(req, res) {
    const { username, email, password } = req.body;

    if((!username && !email) || !password) {
        return res.status(400).json({message: "Username or email and password requierd"});
    }

    try{
        //find user by username or email
        const [rows] = await poolPromise.query('SELECT id, username, email, password_hash, role FROM users WHERE username = ? OR email = ?', [username || null, email || null]);
            
        if(rows.length === 0) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const user = rows[0];

        // compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if(!isMatch) {
            return res.status(401).json({message: "Invalid password"});
        }

        //create tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //save refresh token in database
        const expiresAt = new Date(Date.now() + 7*24*60*60*1000);//7days
        await saveRefreshToken(user.id, refreshToken, expiresAt);

        // send refresh token as httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // for production //process.env.NODE_ENV === 'production'
            sameSite: 'lax',// for production 'strict'
            maxAge: 7*24*60*60*1000,
        });

        res.json({
            message: "Login successful",
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch(err) {
        console.error("login error", err);
        res.status(500).json({message: "Database error", error: err.message});
    }
};

// Refresh
export const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({message: 'No refresh token provided'});
    }
    try {
        //check token in db
        const dbToken = await verifyRefreshToken(token);
        if(!dbToken) {
            return res.status(403).json({message: 'invalid or expired refresh token'});
        }

        // Generate access token
        const userId = dbToken.user_id;
        const [rows] = await poolPromise.query('SELECT id, role FROM users WHERE id=?', [userId]);
        const user = rows[0];

        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken});
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
}

// Register
export async function registerUser( req, res ) {
    try {
        const { username, email, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({message: "Username, email and password required"});
        } 

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if( !trimmedUsername || !trimmedEmail) {
            return res.status(400).json({
                message: "Invalid Username or email"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await poolPromise.query('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [trimmedUsername, trimmedEmail, hashedPassword, 'user']);
        
        res.json({
            message: "User registered sussecfully",
            userId: result.insertId
        });
    }catch(err) {
            console.error("Register error", err);

            if(err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    message: "User already exists"
                });
            }

            res.status(500).json({
                message: "Internal server error"
            });
        }
};

//logout
export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if(token) await revokeRefreshToken(token);

    res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'lax', secure: false});
    res.json({message: 'Logged out succesfully'});
}