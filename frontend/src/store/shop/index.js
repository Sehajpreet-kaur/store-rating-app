import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios.js";

const initialState = {
  stores: [],
  storesLoading: false,
  ratingInFlight: null, // storeId currently being rated
};

// params: { name, address, sortBy, sortOrder }
export const fetchStores = createAsyncThunk("/shop/fetchStores", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await axios.get("/user/stores", { params });
    return data;
  } catch (e) {
    return rejectWithValue(e?.response?.data || { success: false, message: "Could not load stores" });
  }
});

export const submitRating = createAsyncThunk(
  "/shop/submitRating",
  async ({ storeId, value }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/user/stores/${storeId}/rating`, { value });
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { success: false, message: "Could not save rating" });
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.storesLoading = true;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.storesLoading = false;
        state.stores = action.payload.stores || [];
      })
      .addCase(fetchStores.rejected, (state) => {
        state.storesLoading = false;
      })
      .addCase(submitRating.pending, (state, action) => {
        state.ratingInFlight = action.meta.arg.storeId;
      })
      .addCase(submitRating.fulfilled, (state, action) => {
        state.ratingInFlight = null;
        // Update just that store in place so the list doesn't re-sort/flicker.
        const { storeId, userRating, averageRating, ratingCount } = action.payload;
        const store = state.stores.find((s) => s.id === storeId);
        if (store) Object.assign(store, { userRating, averageRating, ratingCount });
      })
      .addCase(submitRating.rejected, (state) => {
        state.ratingInFlight = null;
      });
  },
});

export default shopSlice.reducer;
