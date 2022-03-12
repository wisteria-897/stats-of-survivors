import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AddChiefPanel, ChiefDisplayPanel, ChiefList, ChiefPanel } from './features/chief/ChiefPanel';
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
                            <Route path="new" element={<AddChiefPanel/>}/>
                            <Route path=":chiefId" element={<ChiefDisplayPanel/>}/>
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
