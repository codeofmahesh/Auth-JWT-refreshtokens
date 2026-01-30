import { logoutUser } from "../../services/authServices";
import "./dashboard.css";

export default function Dashboard({user, onLogout}) {

    const handleLogout = async () => {
        await logoutUser();
        onLogout();
    }

    return (
        <div className="dashboard-container">
            <div className="profile-container">
                <h2>User Profile</h2>
                <div className="user-profile">
                    <p><strong>Username:</strong> {user.username}</p>    
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            
        </div>
    );
}