import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Chat from './components/Chat';

const App = () => {
    const [user, setUser] = useState(null);

    return (
        <Router>
            <Routes>
                {/* Redirect "/" to "/register" */}
                <Route path="/" element={<Navigate to="/register" />} />

                {/* Registration route */}
                <Route path="/register" element={<Register />} />

                {/* Login route */}
                <Route path="/login" element={<Login onLogin={setUser} />} />

                {/* Home route */}
                <Route
                    path="/home"
                    element={user ? <Home user={user} /> : <Navigate to="/login" />}
                />

                {/* Chat route */}
                <Route
                    path="/chat/:username"
                    element={user ? <Chat sender={user.username} /> : <Navigate to="/login" />}
                />

                {/* Fallback for unmatched routes */}
                <Route path="*" element={<Navigate to="/register" />} />
            </Routes>
        </Router>
    );
};

export default App;
