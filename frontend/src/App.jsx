import { useEffect } from "react";
import Login from "./pages/auth/Login.jsx";
import AuthLayout from "./components/auth/layout.jsx";
import { Route, Routes } from "react-router-dom";
import CheckAuth from "./common/checkAuth.jsx";
import { useDispatch, useSelector } from "react-redux";
import UnauthPage from "./pages/unauth-page/index.jsx";
import Register from "./pages/auth/Register.jsx"
import { checkAuth } from "./store/auth/index.js";

import AdminLayout from "./components/admin/Layout.jsx";
import AdminDashboard from "./components/admin/Dashboard.jsx";
import AdminUsers from "./pages/admin/Users.jsx";
import AdminAddUser from "./pages/admin/AddUser.jsx";
import AdminUserDetails from "./pages/admin/UserDetails.jsx";
import AdminStores from "./pages/admin/Stores.jsx";
import AdminAddStore from "./pages/admin/AddStore.jsx";

import UserLayout from "./components/user/Layout.jsx";
import UserHome from "./components/user/Home.jsx";
import StoreOwnerLayout from "./components/store_owner/Layout.jsx";
import StoreOwnerDashboard from "./components/store_owner/Dashboard.jsx";
import UpdatePassword from "./pages/common/UpdatePassword.jsx";

function App() {
  const dispatch = useDispatch();
  const {isCheckingAuth, isAuthenticated, user} = useSelector((state)=> state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) return <div className="p-8">Loading...</div>;

  return (
    <>
        <Routes>
          <Route path="/" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={false} >
            </CheckAuth>
          } />
          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={false} >
              <AuthLayout />
            </CheckAuth>
          } >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/admin" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={false} >
              <AdminLayout />
            </CheckAuth>
          } >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AdminAddUser />} />
            <Route path="users/:id" element={<AdminUserDetails />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="stores/new" element={<AdminAddStore />} />
          </Route>

          <Route path="/shop" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={false} >
              <UserLayout />
            </CheckAuth>
          } >
            <Route path="home" element={<UserHome />} />
            <Route path="password" element={<UpdatePassword />} />
          </Route>

          <Route path="/store-owner" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} isLoading={false} >
              <StoreOwnerLayout />
            </CheckAuth>
          } >
            <Route path="dashboard" element={<StoreOwnerDashboard />} />
            <Route path="password" element={<UpdatePassword />} />
          </Route>

          <Route path="/unauth-page" element={<UnauthPage />} />

        </Routes>
    </>
  )
}

export default App
