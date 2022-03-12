import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './features/navigation/Navigation';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Navigation/>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default App;
