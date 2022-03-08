import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PayloadIdTuple<T, U> {
    id: T;
    value: U;
}

export interface PayloadActionWithId<T, U> extends PayloadAction<PayloadIdTuple<T, U>> { }
