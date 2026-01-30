import jwt from "jsonwebtoken";
import poolPromise from "../config/db.js";

// Create access token
export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m'}
    );
};

// create refresh token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d'}
    );
};

// save refresh token to database
export const saveRefreshToken = async (userId, token, expiresAt) => {
    const sql = 'INSERT INTO refresh_token (user_id, token, expires_at) VALUES (?, ?, ?)';
    await poolPromise.query(sql, [userId, token, expiresAt]);
}; 

// verifiy refresh token check if revoked or expired
export const verifyRefreshToken = async (token) => {
    const sql = 'SELECT * FROM refresh_token WHERE token=? AND revoked=FALSE AND expires_at > NOW()';

    const [rows] = await poolPromise.query(sql, token);
    return rows[0];
};

// revoke refresh token
export const revokeRefreshToken = async (token) => {
    const sql = 'UPDATE refresh_token SET revoked=TRUE WHERE token=?';
    await poolPromise.query(sql, [token]);
}