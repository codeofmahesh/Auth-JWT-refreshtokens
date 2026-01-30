import poolPromise from "../config/db.js";
import bcrypt, { hash } from 'bcrypt';

//show all users
export async function getUsers(req, res) {
    try{
        const [result] = await poolPromise.query('SELECT * FROM users');
        res.json(result);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Database error'});
    }
}

// Get one user
export async function getUser(req, res) {
    try{
        const {id} = req.params;

        const [result] = await poolPromise.query('SELECT * FROM users WHERE id=?', [id]);

        if(!result) {
            return res.status(400).json({message: "User not found"});
        }
        res.json(result[0]);
    }catch(err) {
        console.error(err);
        res.status(500).json({message: "Database error"});
    }
}

// Add user
export async function addUser(req, res) {
    const {username, email, password, role} = req.body;

    // Basic validation
    if(!username || !email || !password) {
        return res.status(400).json({message: "Username, email and password are required"});
    }

    try{
        //Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await poolPromise.query("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)", [username, email, hashedPassword, role || 'user']);

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId
        });
    } catch(err) {
        console.error(err);

        // handle unique constraint error
        if(err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({message: "Username or email already exist"});
        }

        res.status(500).json({message: "Database eror"});
    }
}

// Update user
export async function updateUser(req, res) {
    const {id} = req.params;
    const {username, email, password, role} = req.body;

    // Build query dynamically based on provided fields
    const updates = [];
    const values = [];

    if(username) {
        updates.push("username = ?");
        values.push(username);
    }
    if(email) {
        updates.push("email = ?");
        values.push(email);
    }
    if(password) {
        updates.push("password_hash = ?");
        const hashedPassword = await bcrypt.hash(password, 10);
        values.push(hashedPassword);
    }
    if(role){
        updates.push("role = ?");
        values.push(role);
    }

    if(updates.length === 0) {
        return res.status(400).json({message: "No field to update"});
    }

    values.push(id);

    const sql = `UPDATE users SET ${updates.join(",")} WHERE id = ?`;

    try {
        const [result] = await poolPromise.query(sql, values);
        if(result.affectedRows === 0) {
            return res.status(404).json({message: "User not found"});
        }
        res.json({message: "User updated successfully"});
    } catch(err) {
        console.error(err);
        res.result(500).json({messagge: "Databse error"});
    }
};

// Delete user
export async function deleteUser(req, res) {
    const {id} = req.params;

    try {
        const [result] = await poolPromise.query('DELETE FROM users WHERE id = ?', [id]);
        
        if(result.affectedRows === 0) {
            return req.status(404).json({message: "User not found"});
        }

        res.json({message: "User deleted"});
    }catch(err) {
        console.error(err);
        req.status(500).json({message: "Database error"});
    }
};