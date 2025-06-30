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
            // Avoid adding duplicate bubbles
            if (message.sender !== sender) {
                setMessages((prev) => [...prev, message]);
            }
        });

        // **Mark messages as read when opening chat**
        fetch('http://localhost:5000/api/users/mark-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: receiver, receiver: sender }), // Reverse to mark incoming messages as read
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

    const sendMessage = () => {
        if (text.trim()) {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Emit the message to the server
            socket.emit('privateMessage', { sender, receiver, text, timestamp });

            // Add the message locally (only for the sender)
            setMessages((prev) => [
                ...prev,
                { sender, receiver, text, timestamp },
            ]);

            // Call backend API to update contacts
            fetch('http://localhost:5000/api/users/update-contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender, receiver }),
            });

            setText(''); // Clear the input field
        }
    };

    // **Mark messages as read when exiting chat**
    const handleExitChat = () => {
        fetch('http://localhost:5000/api/users/mark-read', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sender: receiver, receiver: sender }), // Reverse to mark incoming messages as read
        });

        navigate('/home'); // Redirect to home after marking messages as read
    };

    return (
        <div className="chat-screen">
            {/* Header */}
            <div className="chat-header">
                <div className="header-info">
                    <h3>{receiver}</h3>
                </div>
                <FiArrowLeft className="back-icon" onClick={handleExitChat} />
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender === sender ? 'sent' : 'received'}`}>
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
 