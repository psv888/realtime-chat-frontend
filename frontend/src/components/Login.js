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
            const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
            onLogin(response.data.user);
            navigate('/home');
        } catch (error) {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="form-container">
            <h2>Welcome Back</h2>
            <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>
                New here?{' '}
                <button onClick={() => navigate('/register')}>
                    Create an account
                </button>
            </p>
        </div>
    );
};


export default Login;
