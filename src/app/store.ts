import { combineReducers, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Middleware } from 'redux';
import allianceReducer from '../features/alliance/allianceSlice';
import chiefReducer, { chiefStatePersister } from '../features/chief/chiefSlice';
import navigationReducer, { navigationStatePersister } from '../features/navigation/navigationSlice';

const rootReducer = combineReducers(
    {
        alliance: allianceReducer,
        chief: chiefReducer,
        navigation: navigationReducer
    }
);

export type RootState = ReturnType<typeof rootReducer>;

const persisterMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
    const result = next(action);
    chiefStatePersister.save(store.getState().chief);
    navigationStatePersister.save(store.getState().navigation);
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
