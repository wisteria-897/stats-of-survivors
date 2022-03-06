import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import allianceReducer from '../features/alliance/allianceSlice';
import chiefReducer from '../features/chief/chiefSlice';
import navigationReducer from '../features/navigation/navigationSlice';

export const store = configureStore({
  reducer: {
    alliance: allianceReducer,
    chief: chiefReducer,
    navigation: navigationReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
