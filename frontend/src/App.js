import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Chat from './components/Chat';
import SearchUser from './components/SearchUser'; // Updated import

const App = () => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('chatUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const handleLogin = (userData) => {
        localStorage.setItem('chatUser', JSON.stringify(userData));
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('chatUser');
        setUser(null);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={user ? "/home" : "/register"} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/home" element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
                <Route path="/chat/:username" element={user ? <Chat sender={user.username} /> : <Navigate to="/login" />} />
                <Route path="/search-user" element={user ? <SearchUser /> : <Navigate to="/login" />} /> {/* Updated route */}
                <Route path="*" element={<Navigate to={user ? "/home" : "/register"} />} />
            </Routes>
        </Router>
    );
};

export default App;
 