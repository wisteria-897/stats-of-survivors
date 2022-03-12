import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { NavigateFunction } from 'react-router-dom';

type PayloadIdTuple<T, U> = {
    id: T;
    value: U;
}

type NavigatingPayload<T> = {
    navigate: NavigateFunction;
    value: T;
}

export type NavigatingPayloadAction<T> = PayloadAction<NavigatingPayload<T>>;
export type PayloadActionWithId<T, U> = PayloadAction<PayloadIdTuple<T, U>>;
