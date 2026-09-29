import { Navigate, useLocation } from "react-router-dom";

const HOME_BY_ROLE = {
  admin: "/admin/dashboard",
  store_owner: "/store-owner/dashboard",
  normal: "/shop/home",
};

// Which URL prefix each role is allowed to visit.
const PREFIX_BY_ROLE = {
  admin: "/admin",
  store_owner: "/store-owner",
  normal: "/shop",
};

const PROTECTED_PREFIXES = Object.values(PREFIX_BY_ROLE);

function CheckAuth({ isAuthenticated, user, children, isLoading }) {
  const { pathname } = useLocation();

  if (isLoading) return <div className="p-8">Loading...</div>;

  const isAuthPage = pathname.startsWith("/auth");
  const home = HOME_BY_ROLE[user?.role] || "/shop/home";

  // "/" -> send everyone to the right place
  if (pathname === "/") {
    return <Navigate to={isAuthenticated ? home : "/auth/login"} replace />;
  }

  if (!isAuthenticated) {
    return isAuthPage ? children : <Navigate to="/auth/login" replace />;
  }

  // Logged in but visiting login/register
  if (isAuthPage) return <Navigate to={home} replace />;

  // Role-based access: a user may only enter their own section.
  const allowedPrefix = PREFIX_BY_ROLE[user?.role];
  const isOtherRolesSection = PROTECTED_PREFIXES.some(
    (prefix) => prefix !== allowedPrefix && pathname.startsWith(prefix)
  );
  if (isOtherRolesSection) return <Navigate to="/unauth-page" replace />;

  return children;
}

export default CheckAuth;
