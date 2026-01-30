import { useState } from "react";
import { registerUser } from "../../services/authServices.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./register.css";

export default function Register() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(username, email, password);
            console.log(response.messgae);
            navigate('/');
        } catch(err) {
            setError(err.response?.message || "Invalid credentials")
        }
    }

    return(
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                { error && <p className="error">{error}</p>}

                <div className="form-group">
                    <input type="text" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="register-btn" type="submit">Register</button>
                <p className="login-link">
                    Already have an account? <Link to='/' >Login</Link>
                </p>
            </form>
        </div>
    );
}