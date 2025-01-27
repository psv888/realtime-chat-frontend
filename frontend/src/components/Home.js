import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMoreVertical, FiTrash2, FiSearch } from 'react-icons/fi';
import './styles.css';


const Home = ({ user }) => {
    const [contacts, setContacts] = useState([]);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null); // Holds the search result
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${user.username}/contacts`);
                const data = await response.json();
                setContacts(data.contacts || []);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };

        fetchContacts();
    }, [user.username]);

    const toggleSelectMode = () => {
        setIsSelectMode((prev) => !prev);
        setSelectedContacts([]);
        document.getElementById('menu-dropdown').classList.remove('show'); // Fade out menu
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
            setContacts((prev) => prev.filter((c) => !selectedContacts.includes(c)));
            setSelectedContacts([]);
            setIsSelectMode(false);
        } catch (error) {
            console.error('Error deleting contacts:', error);
        }
    };

    const logout = () => {
        navigate('/login');
    };

    const handleSearch = async () => {
        try {
            // Search for the username in the backend
            const response = await fetch(`http://localhost:5000/api/users/search/${searchQuery}`);
            const data = await response.json();
            setSearchResult(data.username || null); // If the user is found, set the result
        } catch (error) {
            console.error('Error searching for user:', error);
            setSearchResult(null);
        }
    };

    const addContact = async () => {
        try {
            if (!contacts.includes(searchResult)) {
                await fetch('http://localhost:5000/api/users/add-contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: user.username, contact: searchResult }),
                });
                setContacts((prev) => [...prev, searchResult]);
                setSearchResult(null); // Clear the search result after adding
                alert('Contact added successfully!');
            } else {
                alert('User is already in your contact list.');
            }
        } catch (error) {
            console.error('Error adding contact:', error);
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
                        <p onClick={logout}>Logout</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-bar">
                <FiSearch className="search-icon" onClick={handleSearch} />
                <input
                    type="text"
                    placeholder="Search for users"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Search Result */}
            {searchResult && (
                <div className="search-result">
                    <p>{searchResult}</p>
                    <button onClick={addContact}>Add to Contact List</button>
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
                    <li
                        key={contact}
                        className="contact-item"
                        onClick={() => !isSelectMode && navigate(`/chat/${contact}`)}
                    >
                        <div className="contact-info">
                            <div className="contact-avatar">{contact[0].toUpperCase()}</div>
                            <span className="contact-name">{contact}</span>
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
        </div>
    );
};

export default Home;
