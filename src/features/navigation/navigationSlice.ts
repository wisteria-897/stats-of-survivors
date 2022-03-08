import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createPersister } from '../../util/persistence';

export enum Page {
    Chief,
    Alliance,
    CustomChestPlanner,
    Formations,
    SpeedUps
}

export interface NavigationState {
    currentPage: Page
}

const initialState: NavigationState = {
    currentPage: Page.Formations
};

export const navigationStatePersister = createPersister('navigation', initialState);

export const navigationSlice = createSlice({
    name: 'navigation',
    initialState: navigationStatePersister.load(),
    reducers: {
        setCurrentPage: (state, action: PayloadAction<Page>) => {
            state.currentPage = action.payload;
        }
    }
});

export const { setCurrentPage } = navigationSlice.actions;
export const selectCurrentPage = (state: RootState) => state.navigation.currentPage;
export default navigationSlice.reducer;
