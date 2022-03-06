import React from 'react';
import { useAppSelector } from './app/hooks';
import { ChiefPanel } from './features/chief/ChiefPanel';
import { CustomChestPlanner } from './features/customChest/CustomChest';
import { TroopPanel } from './features/troops/TroopPanel';
import { Page, selectCurrentPage } from './features/navigation/navigationSlice';
import { Navigation } from './features/navigation/Navigation';
import './App.css';

const ActivePage = (props: any) => {
    if (props.page === Page.Chief) {
        return <ChiefPanel />;
    } else if (props.page === Page.CustomChestPlanner) {
        return <CustomChestPlanner />;
    } else if (props.page === Page.Formations) {
        return <TroopPanel />;
    }

    return <div />;
}

function App() {
    const currentPage = useAppSelector(selectCurrentPage);
    return (
        <div className="App">
            <header className="App-header">
                <Navigation/>
            </header>
            <main>
                <ActivePage page={currentPage} />
            </main>
        </div>
    );
}

export default App;
