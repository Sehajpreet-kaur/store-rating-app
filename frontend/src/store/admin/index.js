import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios.js";

const initialState = {
    stats: { totalUsers: 0, totalStores: 0, totalRatings: 0 },
    statsLoading: false,

    users: [],
    usersLoading: false,

    stores: [],
    storesLoading: false,

    selectedUser: null,
    selectedUserLoading: false,

    isSubmitting: false,
};

export const fetchDashboardStats = createAsyncThunk("/admin/fetchDashboardStats",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/admin/dashboard");
            return response.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data || { success: false });
        }
    });

// params: { name, email, address, role, sortBy, sortOrder }
export const fetchAllUsers = createAsyncThunk("/admin/fetchAllUsers",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get("/admin/users", { params });
            return response.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data || { success: false });
        }
    });

// params: { name, email, address, sortBy, sortOrder }
export const fetchAllStores = createAsyncThunk("/admin/fetchAllStores",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get("/admin/stores", { params });
            return response.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data || { success: false });
        }
    });

export const fetchUserDetails = createAsyncThunk("/admin/fetchUserDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/admin/users/${id}`);
            return response.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data || { success: false });
        }
    });

export const createUser = createAsyncThunk("/admin/createUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/admin/users", formData);
            return response.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data || { success: false, message: "Could not create user" });
        }
    });

export const createStore = createAsyncThunk("/admin/createStore",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post("/admin/stores", formData);
            return response.data;
        } catch (e) {
            return rejectWithValue(e?.response?.data || { success: false, message: "Could not create store" });
        }
    });

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.statsLoading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsLoading = false;
                if (action.payload?.success) state.stats = action.payload.stats;
            })
            .addCase(fetchDashboardStats.rejected, (state) => {
                state.statsLoading = false;
            })

            .addCase(fetchAllUsers.pending, (state) => {
                state.usersLoading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.usersLoading = false;
                if (action.payload?.success) state.users = action.payload.users;
            })
            .addCase(fetchAllUsers.rejected, (state) => {
                state.usersLoading = false;
            })

            .addCase(fetchAllStores.pending, (state) => {
                state.storesLoading = true;
            })
            .addCase(fetchAllStores.fulfilled, (state, action) => {
                state.storesLoading = false;
                if (action.payload?.success) state.stores = action.payload.stores;
            })
            .addCase(fetchAllStores.rejected, (state) => {
                state.storesLoading = false;
            })

            .addCase(fetchUserDetails.pending, (state) => {
                state.selectedUserLoading = true;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.selectedUserLoading = false;
                if (action.payload?.success) state.selectedUser = action.payload.user;
            })
            .addCase(fetchUserDetails.rejected, (state) => {
                state.selectedUserLoading = false;
            })

            .addCase(createUser.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(createUser.fulfilled, (state) => {
                state.isSubmitting = false;
            })
            .addCase(createUser.rejected, (state) => {
                state.isSubmitting = false;
            })

            .addCase(createStore.pending, (state) => {
                state.isSubmitting = true;
            })
            .addCase(createStore.fulfilled, (state) => {
                state.isSubmitting = false;
            })
            .addCase(createStore.rejected, (state) => {
                state.isSubmitting = false;
            });
    },
});

export const { clearSelectedUser } = adminSlice.actions;
export default adminSlice.reducer;
