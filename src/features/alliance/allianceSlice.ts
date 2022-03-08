import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { EnumMap } from '../../util/types';
import { createPersister } from '../../util/persistence';
import { AllianceTech, AllianceTechName, AllianceTechs } from '../../game/allianceTech';

export type AllianceTag = string;
export type AllianceColor = string;

export interface Alliance {
    name: string;
    tag: AllianceTag;
    level: number;
    color: AllianceColor;
    allianceTech: {[key in AllianceTechName]: number};
}

export interface AllianceState {
    alliances: Alliance[],
    selectedAllianceTag: AllianceTag | null;
}

const initialState: AllianceState = {
    alliances: [],
    selectedAllianceTag: null
};

export const allianceStatePersister = createPersister('alliance', initialState);

export const createAlliance = () => {
    const emptyAllianceTech = Object.entries(AllianceTechs).map(([k, v]) => v as AllianceTech).reduce((result, tech) => {
        result[tech.name] = 0;
        return result;
    }, EnumMap.empty<number>(AllianceTechName)) as {[key in AllianceTechName]: number};

    return {
        name: 'Alliance',
        tag: '000',
        level: 1,
        color: '#000',
        allianceTech: emptyAllianceTech
    };
}

export const allianceSlice = createSlice({
    name: 'alliance',
    initialState: allianceStatePersister.load(),
    reducers: {
        addAlliance: (state, action: PayloadAction<Alliance>) => {
            state.alliances = [...state.alliances, action.payload];
            console.log('addAlliance', state.alliances);
        },

        updateAlliance: (state, action: PayloadAction<Alliance>) => {
            const index = state.alliances.findIndex((a: Alliance) => a.tag == action.payload.tag);
            if (index >= 0) {
                const updated = [...state.alliances];
                updated[index] = action.payload;
                state.alliances = updated;
            }
            console.log('updateAlliance', state.alliances);
        },

        setSelectedAlliance: (state, action: PayloadAction<AllianceTag | null>) => {
            state.selectedAllianceTag = action.payload;
        }
    }
});

export const { addAlliance, updateAlliance, setSelectedAlliance } = allianceSlice.actions;

export const selectAlliances = (state: RootState) => {
    return state.alliance.alliances;
}

export const selectAllianceByTag = (state: RootState, tag: AllianceTag) => {
    return state.alliance.alliances.find((a: Alliance) => a.tag == tag) || null;
}

export const selectSelectedAlliance = (state: RootState) => {
    if (state.alliance.selectedAllianceTag == null) {
        return null;
    }
    return selectAllianceByTag(state, state.alliance.selectedAllianceTag);
}

export default allianceSlice.reducer;
