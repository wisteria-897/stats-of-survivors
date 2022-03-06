import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Alliance {
    name: string;
    tag: string;
    color: string;
}

export interface AllianceState {
    alliances: { [tag: string]: Alliance };
    selectedAllianceTag: string;
}

const initialState: AllianceState = {
    alliances: {},
    selectedAllianceTag: 'CO7'
};
initialState.alliances['CO7'] = {
    name: 'Champions of the 7 Seas',
    tag: 'CO7',
    color: '#00a'
};

export const allianceSlice = createSlice({
    name: 'alliance',
    initialState,
    reducers: {
        setSelectedAlliance: (state, action: PayloadAction<string>) => {
            state.selectedAllianceTag = action.payload;
        }
    }
});

export const { setSelectedAlliance } = allianceSlice.actions;

export const selectAllianceByTag = (state: RootState, tag: string) => {
    return state.alliance.alliances[tag];
};
export const selectSelectedAlliance = (state: RootState) => {
    return selectAllianceByTag(state, state.alliance.selectedAllianceTag);
};

export default allianceSlice.reducer;
