import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpDown, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { fetchStores, submitRating } from "../../store/shop/index.js";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import StarRating from "../shared/StarRating.jsx";

const sortFields = [
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "averageRating", label: "Rating" },
];

function UserHome() {
  const dispatch = useDispatch();
  const { stores, storesLoading, ratingInFlight } = useSelector((state) => state.shop);

  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "name", sortOrder: "ASC" });

  function load(nextFilters = filters, nextSort = sort) {
    const params = { ...nextFilters, ...nextSort };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    dispatch(fetchStores(params));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSort(field) {
    const nextSort = {
      sortBy: field,
      sortOrder: sort.sortBy === field && sort.sortOrder === "ASC" ? "DESC" : "ASC",
    };
    setSort(nextSort);
    load(filters, nextSort);
  }

  function handleSearch(e) {
    e.preventDefault();
    load();
  }

  function handleReset() {
    const cleared = { name: "", address: "" };
    setFilters(cleared);
    load(cleared, sort);
  }

  function handleRate(store, value) {
    if (value === store.userRating) return; // same rating, nothing to save
    dispatch(submitRating({ storeId: store.id, value }))
      .unwrap()
      .then((data) => toast.success(data.message))
      .catch((err) => toast.error(err?.message || "Could not save rating"));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Stores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse registered stores and rate them from 1 to 5. You can change your rating any time.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Input
          placeholder="Search by store name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Input
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <div className="flex gap-2 lg:col-span-2">
          <Button type="submit" className="flex-1 sm:flex-none">
            <Search className="size-4" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        {sortFields.map((f) => (
          <Button
            key={f.key}
            type="button"
            size="sm"
            variant={sort.sortBy === f.key ? "default" : "outline"}
            onClick={() => handleSort(f.key)}
          >
            {f.label}
            <ArrowUpDown className="size-3" />
            {sort.sortBy === f.key && <span className="text-xs">{sort.sortOrder === "ASC" ? "↑" : "↓"}</span>}
          </Button>
        ))}
      </div>

      {storesLoading && stores.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading stores…</p>
      ) : stores.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No stores found.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {stores.map((store) => {
            const busy = ratingInFlight === store.id;
            return (
              <li key={store.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
                <div>
                  <h2 className="font-semibold text-foreground">{store.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{store.address || "No address provided"}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">
                    {store.averageRating !== null ? store.averageRating.toFixed(1) : "—"}
                  </span>
                  <span className="text-muted-foreground">
                    overall · {store.ratingCount} {store.ratingCount === 1 ? "rating" : "ratings"}
                  </span>
                </div>

                <div className="mt-auto border-t border-border pt-3">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {store.userRating ? `Your rating: ${store.userRating}/5 — click to modify` : "You haven't rated this store — click to rate"}
                  </p>
                  <StarRating value={store.userRating || 0} onChange={(v) => handleRate(store, v)} disabled={busy} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default UserHome;
