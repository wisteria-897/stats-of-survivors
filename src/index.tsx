import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { BuildingsPanel, ChiefBasicsPanel, ChiefDisplayPanel, ChiefGearPanel, ChiefList, ChiefResearchPanel, ChiefStatsPanel, HeroGearPanel, HeroesPanel, TalentsPanel } from './features/chief/ChiefPanel';
import { AllianceBasicsPanel, AllianceDisplayPanel, AllianceList, AllianceStatsPanel, AllianceTechPanel, AnalysisCentersPanel } from './features/alliance/AlliancePanel';
import { TroopPanel } from './features/troops/TroopPanel';
import SpeedUpPanel from './features/speedups/SpeedUpPanel';
import HomePanel from './features/home/HomePanel';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App/>}>
                        <Route index element={<HomePanel/>}/>
                        <Route path="chiefs">
                            <Route index element={<ChiefList/>}/>
                            <Route path=":chiefId" element={<ChiefDisplayPanel/>}>
                                <Route index element={<ChiefStatsPanel/>}/>
                                <Route path="basics" element={<ChiefBasicsPanel/>}/>
                                <Route path="heroes" element={<HeroesPanel/>}/>
                                <Route path="heroGear" element={<HeroGearPanel/>}/>
                                <Route path="chiefGear" element={<ChiefGearPanel/>}/>
                                <Route path="research" element={<ChiefResearchPanel/>}/>
                                <Route path="talents" element={<TalentsPanel/>}/>
                                <Route path="buildings" element={<BuildingsPanel/>}/>
                            </Route>
                        </Route>
                        <Route path="alliances">
                            <Route index element={<AllianceList/>}/>
                            <Route path=":allianceId" element={<AllianceDisplayPanel/>}>
                                <Route index element={<AllianceStatsPanel/>}/>
                                <Route path="basics" element={<AllianceBasicsPanel/>}/>
                                <Route path="tech" element={<AllianceTechPanel/>}/>
                                <Route path="acs" element={<AnalysisCentersPanel/>}/>
                            </Route>
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
