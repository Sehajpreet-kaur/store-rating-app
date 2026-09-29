import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios.js";

const initialState = {
  dashboard: null,
  loading: false,
};

export const fetchOwnerDashboard = createAsyncThunk("/owner/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/owner/dashboard");
    return data;
  } catch (e) {
    return rejectWithValue(e?.response?.data || { success: false, message: "Could not load dashboard" });
  }
});

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchOwnerDashboard.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default ownerSlice.reducer;
