import React, { useState } from 'react';
import Home from './Home';
import AppAppBar from './components/Navbar';
import { useTheme } from '@mui/material/styles';
import './index.css';
import Box from '@mui/material/Box';

function App() {
    const [listVisible, setListVisible] = useState(true);
    const [currentList, setCurrentList] = useState('all');
    
    const theme = useTheme();

    const handleToggleList = (listName) => {
        if (listName === 'toggleMap') {
            setListVisible(!listVisible);
        } else {
            setCurrentList(listName);
            setListVisible(true);
        }
    };

    return (
        <div style={{backgroundColor: theme.palette.background.default, minHeight: '100vh'}}>
            <AppAppBar onToggleList={handleToggleList}/>
            <img src="/bottom.png" alt="NASA" className="fixed-logo"/>
            <div style={{overflow: '', width: '100%', height: '100%'}}>
            <Box component="section" sx={{p: 6}}>
            </Box>
            <Home isListVisible={listVisible} currentList={currentList}/>
        </div>
</div>
)
    ;
}

export default App;