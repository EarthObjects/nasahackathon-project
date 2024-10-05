import React, { useState } from 'react';
import Home from './Home';
import AppAppBar from './components/Navbar';

function App() {
    const [listVisible, setListVisible] = useState(true);
    const [currentList, setCurrentList] = useState('all');

    const handleToggleList = (listName) => {
        if (listName === 'toggleMap') {
            setListVisible(!listVisible);
        } else {
            setCurrentList(listName);
            setListVisible(true);
        }
    };

    return (
        <div>
            <AppAppBar onToggleList={handleToggleList} />
            <Home isListVisible={listVisible} currentList={currentList} />
        </div>
    );
}

export default App;