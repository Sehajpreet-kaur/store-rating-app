import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./store/auth/index.js";
import adminReducer from "./store/admin/index.js";
import shopReducer from "./store/shop/index.js";
import ownerReducer from "./store/store_owner/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    shop: shopReducer,
    owner: ownerReducer,
  },
});

export default store;
