import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import { fetchAllUsers } from "../../store/admin/index.js";
import { Input } from "../../components/ui/input.jsx";
import { Button, buttonVariants } from "../../components/ui/button.jsx";
import { cn } from "cn";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../../components/ui/select.jsx";

const roleOptions = [
  { id: "", label: "All roles" },
  { id: "normal", label: "Normal User" },
  { id: "store_owner", label: "Store Owner" },
  { id: "admin", label: "System Administrator" },
];

const roleBadgeStyles = {
  admin: "bg-foreground text-background",
  store_owner: "bg-accent text-accent-foreground",
  normal: "bg-secondary text-secondary-foreground",
};

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "role", label: "Role" },
];

function AdminUsers() {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sort, setSort] = useState({ sortBy: "name", sortOrder: "ASC" });

  function loadUsers(nextFilters = filters, nextSort = sort) {
    const params = { ...nextFilters, ...nextSort };
    Object.keys(params).forEach((k) => {
      if (!params[k]) delete params[k];
    });
    dispatch(fetchAllUsers(params));
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSort(field) {
    const nextSort = {
      sortBy: field,
      sortOrder: sort.sortBy === field && sort.sortOrder === "ASC" ? "DESC" : "ASC",
    };
    setSort(nextSort);
    loadUsers(filters, nextSort);
  }

  function handleSearch(event) {
    event.preventDefault();
    loadUsers();
  }

  function handleReset() {
    const cleared = { name: "", email: "", address: "", role: "" };
    setFilters(cleared);
    loadUsers(cleared, sort);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Normal users, store owners, and admins on the platform.
          </p>
        </div>
        <Link to="/admin/users/new" className={cn(buttonVariants({ variant: "default" }))}>
          <Plus className="size-4" />
          Add User
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <Input
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Input
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <Input
          placeholder="Filter by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <Select
          value={filters.role}
          onValueChange={(value) => setFilters({ ...filters, role: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-9999 bg-white">
            {roleOptions.map((opt) => (
              <SelectItem key={opt.id || "all"} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Search className="size-4" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    {col.label}
                    <ArrowUpDown className="size-3" />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {usersLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Loading users…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {u.address || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        roleBadgeStyles[u.role] || "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
