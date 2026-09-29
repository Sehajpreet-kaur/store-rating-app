import TopNavLayout from "../shared/TopNavLayout.jsx";

const navItems = [
  { to: "/store-owner/dashboard", label: "Dashboard" },
  { to: "/store-owner/password", label: "Update Password" },
];

export default function StoreOwnerLayout() {
  return <TopNavLayout navItems={navItems} subtitle="Store Owner" />;
}
