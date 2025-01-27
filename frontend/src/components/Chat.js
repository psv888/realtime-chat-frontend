import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import './styles.css';

const socket = io('http://localhost:5000');

const Chat = ({ sender }) => {
    const { username: receiver } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

    useEffect(() => {
        socket.emit('joinRoom', { sender, receiver });

        socket.on('previousMessages', (data) => {
            setMessages(data);
        });

        socket.on('privateMessage', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('previousMessages');
            socket.off('privateMessage');
        };
    }, [sender, receiver]);

    useEffect(() => {
        // Scroll to the bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Format timestamp as "Jan 25, 2025, 02:30 PM"
    const formatTimestamp = () => {
        const now = new Date();
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
           
        };
        return now.toLocaleString('en-US', options);
    };

    const sendMessage = () => {
        if (text.trim()) {
            const timestamp = formatTimestamp(); // Get formatted timestamp
            socket.emit('privateMessage', { sender, receiver, text, timestamp });
            setText(''); // Clear the input field
        }
    };

    return (
        <div className="chat-screen">
            {/* Header */}
            <div className="chat-header">
                <div className="header-info">
                    <h3>{receiver}</h3>
                </div>
                <FiArrowLeft
                    className="back-icon"
                    onClick={() => navigate('/home')}
                />
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${
                            msg.sender === sender ? 'sent' : 'received'
                        }`}
                    >
                        <p className="message-text">{msg.text}</p>
                        <span className="message-timestamp">{msg.timestamp}</span>
                    </div>
                ))}
                {/* Ref to auto-scroll to the bottom */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="chat-input-box">
                <input
                    type="text"
                    placeholder="Type a message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <FiSend className="send-icon" onClick={sendMessage} />
            </div>
        </div>
    );
};

export default Chat;
