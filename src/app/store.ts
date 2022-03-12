import { combineReducers, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import allianceReducer, { allianceStatePersister } from '../features/alliance/allianceSlice';
import chiefReducer, { chiefStatePersister } from '../features/chief/chiefSlice';

const rootReducer = combineReducers(
    {
        alliance: allianceReducer,
        chief: chiefReducer
    }
);

export type RootState = ReturnType<typeof rootReducer>;

const persisterMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
    const result = next(action);
    allianceStatePersister.save(store.getState().alliance);
    chiefStatePersister.save(store.getState().chief);
    return result;
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: [ persisterMiddleware ]
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
