import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { PayloadActionWithId } from '../../util/payload';
import { enumMapOf } from '../../util/types';
import { createPersister } from '../../util/persistence';
import { AllianceTechName, AllianceTechs } from '../../game/allianceTech';
import { ACType, AnalysisCenters } from '../../game/analysisCenters';
const uuid = require('uuid');

export type AllianceId = string;
export type AllianceTag = string;
export type AllianceColor = string;

export type Alliance = {
    id: string;
    name: string;
    tag: AllianceTag;
    level: number;
    color: AllianceColor;
    allianceTech: {[key in AllianceTechName]: number};
    analysisCenters: Record<ACType, boolean>;
}

export interface AllianceState {
    alliances: Alliance[]
}

const initialState: AllianceState = {
    alliances: []
};

const defaultAlliance: Alliance = {
    id: '',
    name: 'Alliance',
    tag: '000',
    level: 1,
    color: '#000000',
    allianceTech: enumMapOf(AllianceTechs, 0),
    analysisCenters: enumMapOf(AnalysisCenters, false)
};

export const allianceStatePersister = createPersister('alliance', initialState, undefined, data => {
    const state = JSON.parse(data);
    state.alliances = state.alliances.map((alliance: Alliance) => {
        return Object.assign({}, defaultAlliance, {id: ''}, alliance);
    });
    return state;
});
(state => {
    const missingIds = state.alliances.reduce((result: boolean, alliance: Alliance) => {
        if (alliance.id === '') {
            alliance.id = uuid.v4();
            return true;
        }
        return result;
    }, false);
    if (missingIds) {
        allianceStatePersister.save(state);
    }
})(allianceStatePersister.load());

export const createAlliance = (...sources: Partial<Alliance>[]) => {
    return Object.assign({}, defaultAlliance, ...sources, {id: uuid.v4()});
}

export const allianceSlice = createSlice({
    name: 'alliance',
    initialState: allianceStatePersister.load(),
    reducers: {
        addAlliance: (state, action: PayloadAction<Alliance>) => {
            state.alliances = [...state.alliances, action.payload];
        },

        deleteAlliance: (state, action: PayloadAction<Alliance>) => {
            const index = state.alliances.findIndex((a: Alliance) => a.id === action.payload.id);
            if (index >= 0) {
                const updated = [...state.alliances];
                updated.splice(index, 1);
                state.alliances = updated;
            }
        },

        partialUpdateAlliance: (state, action: PayloadActionWithId<AllianceTag, Partial<Alliance>>) => {
            const index = state.alliances.findIndex((a: Alliance) => a.id === action.payload.id);
            if (index >= 0) {
                const updated = [...state.alliances];
                updated[index] = Object.assign({}, updated[index], action.payload.value);
                state.alliances = updated;
            }
        }
    }
});

export const { addAlliance, deleteAlliance, partialUpdateAlliance } = allianceSlice.actions;

export const selectAlliances = (state: RootState) => {
    return state.alliance.alliances;
}

export const selectAlliance = (state: RootState, id: string) => {
    return state.alliance.alliances.find((a: Alliance) => a.id === id) || null;
}

export const selectAllianceByIdOrTag = (state: RootState, idOrTag: string) => {
    const alliance = state.alliance.alliances.find((a: Alliance) => {
        return (a.id === idOrTag || a.tag === idOrTag);
    });
    return alliance || null;
}

export default allianceSlice.reducer;
