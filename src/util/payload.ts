import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PayloadIdTuple<T> {
    id: number;
    value: T;
}

export interface PayloadActionWithId<T> extends PayloadAction<PayloadIdTuple<T>> { }
