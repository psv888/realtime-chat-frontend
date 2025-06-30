import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                username,
                password,
            });

            const userData = response.data.user;
            localStorage.setItem('chatUser', JSON.stringify(userData)); // Store user in localStorage
            onLogin(userData); // Update state
            navigate('/home');
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Welcome Back</h2>
            <input type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p>
                New here?{' '}
                <button onClick={() => navigate('/register')} className="link-button">
                    Create an account
                </button>
            </p>
        </div>
    );
};

export default Login;
