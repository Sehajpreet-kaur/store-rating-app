import TopNavLayout from "../shared/TopNavLayout.jsx";

const navItems = [
  { to: "/shop/home", label: "Stores" },
  { to: "/shop/password", label: "Update Password" },
];

export default function UserLayout() {
  return <TopNavLayout navItems={navItems} subtitle="Normal User" />;
}
