import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiTrash2, FiSearch, FiLogOut,FiShuffle } from 'react-icons/fi';
import io from 'socket.io-client';
import './styles.css';

const socket = io('http://localhost:5000');

const Home = ({ user, onLogout }) => {
    const [contacts, setContacts] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${user.username}/contacts`);
                const data = await response.json();
                setContacts(data.contacts || []);
                setUnreadCounts(data.unreadCounts || {});
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();

        // Listen for unread count updates
        socket.on('updateUnreadCount', ({ username, unreadCounts }) => {
            if (username === user.username) {
                setUnreadCounts(unreadCounts);
            }
        });

        // Listen for incoming messages
        socket.on('privateMessage', ({ sender }) => {
            moveUserToTop(sender);
        });

        // Listen for sent messages
        socket.on('messageSent', (receiver) => {
            moveUserToTop(receiver);
        });

        return () => {
            socket.off('updateUnreadCount');
            socket.off('privateMessage');
            socket.off('messageSent');
        };
    }, [user.username]);

    const moveUserToTop = (username) => {
        setContacts((prevContacts) => {
            let updatedContacts = prevContacts.filter((contact) => contact !== username);
            updatedContacts.unshift(username);
            return updatedContacts;
        });
    };

    const toggleSelectMode = () => {
        setIsSelectMode((prev) => !prev);
        setSelectedContacts([]);
        document.getElementById('menu-dropdown').classList.remove('show');
    };

    const handleContactSelect = (contact) => {
        setSelectedContacts((prev) =>
            prev.includes(contact) ? prev.filter((c) => c !== contact) : [...prev, contact]
        );
    };

    const deleteSelectedContacts = async () => {
        try {
            for (const contact of selectedContacts) {
                await fetch('http://localhost:5000/api/users/remove-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: user.username, contact }),
                });
            }

            // Re-fetch the updated contact list from the backend
            const response = await fetch(`http://localhost:5000/api/users/${user.username}/contacts`);
            const data = await response.json();
            setContacts(data.contacts || []); // Update the contacts state with the latest data
            setUnreadCounts(data.unreadCounts || {}); // Update unread counts

            setSelectedContacts([]); // Clear selected contacts
            setIsSelectMode(false); // Exit selection mode
        } catch (error) {
            console.error('Error deleting contacts:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('chatUser');
        onLogout();
        navigate('/login');
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setFilteredUsers([]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/search-filter/${query}`);
            const data = await response.json();
            setFilteredUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching filtered users:', error);
            setFilteredUsers([]);
        }
    };

    const handleAddContact = async () => {
        if (selectedUser && !contacts.includes(selectedUser)) {
            try {
                await fetch('http://localhost:5000/api/users/add-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: user.username, contact: selectedUser }),
                });

                // Move the newly added user to the top of the list
                setContacts((prev) => [selectedUser, ...prev.filter((contact) => contact !== selectedUser)]);

                setSelectedUser(null);
                setSearchQuery('');
                setFilteredUsers([]);
                alert('Contact added successfully!');
            } catch (error) {
                console.error('Error adding contact:', error);
            }
        } else {
            alert('User is already in your contact list or not selected.');
        }
    };

    return (
        <div className="home-screen">
            {/* Header */}
            <div className="home-header">
                <h2>{user.username}</h2>
                <div className="menu">
                    <FiMoreVertical
                        className="menu-icon"
                        onClick={() => document.getElementById('menu-dropdown').classList.toggle('show')}
                    />
                    <div id="menu-dropdown" className="menu-dropdown">
                        <p onClick={toggleSelectMode}>{isSelectMode ? 'Cancel Selection' : 'Select'}</p>
                        <p onClick={handleLogout}><FiLogOut /> Logout</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search for users"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Filtered Search Results */}
            {filteredUsers.length > 0 && (
                <ul className="filtered-users-list">
                    {filteredUsers.map((user) => (
                        <li key={user} onClick={() => setSelectedUser(user)} className="filtered-user-item">
                            {user}
                        </li>
                    ))}
                </ul>
            )}

            {/* Add Contact Button */}
            {selectedUser && (
                <div className="selected-user">
                    <p>{selectedUser}</p>
                    <button onClick={handleAddContact}>Add to Contacts</button>
                </div>
            )}

            {/* Delete Button */}
            {isSelectMode && selectedContacts.length > 0 && (
                <div className="delete-bar">
                    <FiTrash2 className="delete-icon" onClick={deleteSelectedContacts} />
                </div>
            )}

            {/* Contacts List */}
            <ul className={`contacts-list ${isSelectMode ? 'select-mode' : ''}`}>
                {contacts.map((contact) => (
                    <li key={contact} className="contact-item" onClick={() => !isSelectMode && navigate(`/chat/${contact}`)}>
                        <div className="contact-info">
                            <div className="contact-avatar">{contact[0].toUpperCase()}</div>
                            <span className="contact-name">{contact}</span>
                            {unreadCounts[contact] > 0 && (
                                <span className="unread-count">{unreadCounts[contact]}</span>
                            )}
                        </div>
                        {isSelectMode && (
                            <input
                                type="checkbox"
                                className="contact-checkbox"
                                checked={selectedContacts.includes(contact)}
                                onChange={() => handleContactSelect(contact)}
                            />
                        )}
                    </li>
                ))}
            </ul>

            <button className="shuffle-button" onClick={() => navigate('/search-user')}>
                <FiShuffle size={24} />
            </button>
           
        </div>
    );
};

export default Home;
