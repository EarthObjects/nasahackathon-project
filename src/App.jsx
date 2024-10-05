import React, {useState} from 'react';
import './App.css';
import Navbar from './Navbar';
import Home from './Home';

function App() {
    const [isListVisible, setIsListVisible] = useState(true);

    const handleToggleList = () => {
        setIsListVisible(!isListVisible);
    }

    return (
        <div className="App">
            <Navbar onToggleList={handleToggleList}/>
            <div className="content">
                <Home isListVisible={isListVisible} />
            </div>
        </div>
    );
}

export default App;