import React, { useState } from 'react';

const SearchUser = ({ onSelectUser }) => {
    const [friendUsername, setFriendUsername] = useState('');

    const handleSearch = () => {
        if (!friendUsername.trim()) {
            alert('Please enter a friend\'s username!');
            return;
        }
        onSelectUser(friendUsername.trim());
    };

    return (
        <div>
            <h2>Search for a Friend</h2>
            <input
                type="text"
                placeholder="Friend's Username"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
            />
            <button onClick={handleSearch}>Start Chat</button>
        </div>
    );
};

export default SearchUser;
