import React from 'react';
import { useAppSelector } from './app/hooks';
import { ChiefPanel } from './features/chief/ChiefPanel';
import AlliancePanel from './features/alliance/AlliancePanel';
import { CustomChestPlanner } from './features/customChest/CustomChest';
import { TroopPanel } from './features/troops/TroopPanel';
import SpeedUpPanel from './features/speedups/SpeedUpPanel';
import { Page, selectCurrentPage } from './features/navigation/navigationSlice';
import { Navigation } from './features/navigation/Navigation';
import './App.css';

const ActivePage = (props: any) => {
    switch (props.page) {
        case Page.Chief:
            return <ChiefPanel />;
        case Page.CustomChestPlanner:
            return <CustomChestPlanner />;
        case Page.Formations:
            return <TroopPanel />;
        case Page.SpeedUps:
            return <SpeedUpPanel />;
        case Page.Alliance:
            return <AlliancePanel />;
        default:
            return <div />;
    }
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
