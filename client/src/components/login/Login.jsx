import { useState } from "react";
import { userLogin } from "../../services/authServices.js";
import { Link } from "react-router-dom";
import "./login.css";

export default function Login({onLogin}) {

    const [identifier, setIdentifier] = useState(""); // username or email
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await userLogin( identifier, password);

            //store JWT
            localStorage.setItem("accessToken", data.accessToken);

            //store user
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("User logged in.", data.user);

            //pass user up
            onLogin(data.user);
        } catch(err) {
            setError(err.response?.data?.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                { error && <p className="error">{error}</p>}

                <div className="form-group">
                    <label htmlFor="identifier">Username or Email</label>
                    <input type="text" name="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="Username or Email" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="pwd">Password</label>
                    <input type="password" name="pwd" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required/>
                </div>

                <button className="login-btn" type="submit">
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="register-link">
                    Don't have an account? <Link to='/register' >register</Link>
                </p>
            </form>
        </div>
    );
}