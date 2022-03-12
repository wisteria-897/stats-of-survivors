import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BuildingsPanel, ChiefBasicsPanel, ChiefDisplayPanel, ChiefGearPanel, ChiefList, ChiefPanel, ChiefResearchPanel, ChiefStatsPanel, HeroGearPanel, TalentsPanel } from './features/chief/ChiefPanel';
import { AddAlliancePanel, AllianceDisplayPanel, AllianceList, AlliancePanel } from './features/alliance/AlliancePanel';
import { TroopPanel } from './features/troops/TroopPanel';
import SpeedUpPanel from './features/speedups/SpeedUpPanel';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
                        <Route path="chiefs" element={<ChiefPanel/>}>
                            <Route index element={<ChiefList/>}/>
                            <Route path=":chiefId" element={<ChiefDisplayPanel/>}>
                                <Route index element={<ChiefStatsPanel/>}/>
                                <Route path="basics" element={<ChiefBasicsPanel/>}/>
                                <Route path="chiefGear" element={<ChiefGearPanel/>}/>
                                <Route path="heroGear" element={<HeroGearPanel/>}/>
                                <Route path="research" element={<ChiefResearchPanel/>}/>
                                <Route path="talents" element={<TalentsPanel/>}/>
                                <Route path="buildings" element={<BuildingsPanel/>}/>
                            </Route>
                        </Route>
                        <Route path="alliances" element={<AlliancePanel/>}>
                            <Route index element={<AllianceList/>}/>
                            <Route path="new" element={<AddAlliancePanel/>}/>
                            <Route path=":allianceTag" element={<AllianceDisplayPanel/>}/>
                        </Route>
                        <Route path="speedups" element={<SpeedUpPanel/>} />
                        <Route path="formations" element={<TroopPanel/>} />
                        <Route path="*" element={<p>Not found!</p>} />
                    </Route>
                </Routes>
            </HashRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
