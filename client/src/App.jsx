import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Login from './components/login/Login.jsx';
import Register from './components/register/Register.jsx';

function App() {

  // const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("accessToken"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLoggedIn = !!user;

  const handleLogin = (userData) => {
    setUser(userData);
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <Routes>
      <Route path='/' element={
        isLoggedIn ? (
          <Dashboard user={user} onLogout={handleLogout} /> 
        ):(
          <Login onLogin={handleLogin} />
        )
      } />
      <Route path='/register' element={ <Register />}/>
    </Routes>
  );
}

export default App;