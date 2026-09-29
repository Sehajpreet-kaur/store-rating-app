import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowUpDown, Plus, Search, Star } from "lucide-react";
import { fetchAllStores } from "../../store/admin/index.js";
import { Input } from "../../components/ui/input.jsx";
import { Button, buttonVariants } from "../../components/ui/button.jsx";
import { cn } from "cn";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "averageRating", label: "Rating" },
];

function AdminStores() {
  const dispatch = useDispatch();
  const { stores, storesLoading } = useSelector((state) => state.admin);

  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "name", sortOrder: "ASC" });

  function loadStores(nextFilters = filters, nextSort = sort) {
    const params = { ...nextFilters, ...nextSort };
    Object.keys(params).forEach((k) => {
      if (!params[k]) delete params[k];
    });
    dispatch(fetchAllStores(params));
  }

  useEffect(() => {
    loadStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSort(field) {
    const nextSort = {
      sortBy: field,
      sortOrder: sort.sortBy === field && sort.sortOrder === "ASC" ? "DESC" : "ASC",
    };
    setSort(nextSort);
    loadStores(filters, nextSort);
  }

  function handleSearch(event) {
    event.preventDefault();
    loadStores();
  }

  function handleReset() {
    const cleared = { name: "", email: "", address: "" };
    setFilters(cleared);
    loadStores(cleared, sort);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Stores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every store registered on the platform.
          </p>
        </div>
        <Link to="/admin/stores/new" className={cn(buttonVariants({ variant: "default" }))}>
          <Plus className="size-4" />
          Add Store
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
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
            </tr>
          </thead>
          <tbody>
            {storesLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Loading stores…
                </td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No stores found.
                </td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {s.address || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Star className="size-3.5 fill-current" />
                      {s.averageRating ? Number(s.averageRating).toFixed(1) : "—"}
                    </span>
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

export default AdminStores;
