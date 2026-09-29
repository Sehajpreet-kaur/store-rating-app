import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axios.js";

const initialState = {
  isAuthenticated: false,
  isLoading: false, // login/register in flight
  isCheckingAuth: true, // initial token check on app load
  user: null,
};

const errPayload = (e, fallback) => e?.response?.data || { success: false, message: fallback };

export const loginUser = createAsyncThunk("/auth/login", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", formData);
    return data;
  } catch (e) {
    return rejectWithValue(errPayload(e, "Login failed"));
  }
});

// Registration does NOT log the user in; they go to the login page afterwards.
export const registerUser = createAsyncThunk("/auth/register", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", formData);
    return data;
  } catch (e) {
    return rejectWithValue(errPayload(e, "Registration failed"));
  }
});

// The server clears the cookie; the reducer below resets the Redux state.
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  await axiosInstance.post("/auth/logout");
});

export const updatePassword = createAsyncThunk("/auth/updatePassword", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.put("/auth/password", formData);
    return data;
  } catch (e) {
    return rejectWithValue(errPayload(e, "Could not update password"));
  }
});

// Runs on every page load/refresh. The cookie is httpOnly so JS can't inspect it;
// we simply ask the server who we are. 401 => not logged in.
export const checkAuth = createAsyncThunk("/auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  } catch (e) {
    return rejectWithValue(errPayload(e, "Not authenticated"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
