import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // Updated backend URL for local network
            await axios.post('http://localhost:5000/api/users/register', {
                username,
                password,
            });
            alert('Registration successful! Redirecting to login...');
            navigate('/login');
        } catch (error) {
            // Show appropriate error messages
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message); // Use backend error message
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Create an Account</h2>
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
            <button onClick={handleRegister}>Register</button>
            <p>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="link-button">
                    Login here
                </button>
            </p>
        </div>
    );
};

export default Register;
