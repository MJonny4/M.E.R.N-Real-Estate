import { createSlice } from '@reduxjs/toolkit';

interface UserState {
    currentUser: {
        _id: string;
        username: string;
        email: string;
        avatar: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
    } | null;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload; // is the data from the backend
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;
