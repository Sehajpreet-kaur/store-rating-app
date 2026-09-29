import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpDown, Star, Users } from "lucide-react";
import { fetchOwnerDashboard } from "../../store/store_owner/index.js";
import StarRating from "../shared/StarRating.jsx";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "value", label: "Rating" },
  { key: "updatedAt", label: "Date" },
];

const getSortValue = (r, key) => {
  if (key === "name") return r.user?.name?.toLowerCase() ?? "";
  if (key === "email") return r.user?.email?.toLowerCase() ?? "";
  if (key === "updatedAt") return new Date(r.updatedAt).getTime();
  return r.value;
};

function StoreOwnerDashboard() {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((state) => state.owner);
  const [sort, setSort] = useState({ key: "updatedAt", order: "DESC" });

  useEffect(() => {
    dispatch(fetchOwnerDashboard());
  }, [dispatch]);

  const rows = useMemo(() => {
    const list = [...(dashboard?.ratings || [])];
    list.sort((a, b) => {
      const av = getSortValue(a, sort.key);
      const bv = getSortValue(b, sort.key);
      if (av < bv) return sort.order === "ASC" ? -1 : 1;
      if (av > bv) return sort.order === "ASC" ? 1 : -1;
      return 0;
    });
    return list;
  }, [dashboard, sort]);

  function handleSort(key) {
    setSort((s) => ({ key, order: s.key === key && s.order === "ASC" ? "DESC" : "ASC" }));
  }

  if (loading && !dashboard) return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;

  if (dashboard && !dashboard.store) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No store is assigned to your account yet. Ask a system administrator to link a store to you.
        </p>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{dashboard.store.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{dashboard.store.address || dashboard.store.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
            <Star className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <p className="text-3xl font-bold tracking-tight">
              {dashboard.averageRating !== null ? dashboard.averageRating.toFixed(1) : "—"}
            </p>
            {dashboard.averageRating !== null && <StarRating value={Math.round(dashboard.averageRating)} />}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Ratings</p>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">{dashboard.totalRatings}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Users who rated your store</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 font-medium">
                    <button onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-foreground">
                      {col.label}
                      <ArrowUpDown className="size-3" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No one has rated your store yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{r.user?.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.user?.email}</td>
                    <td className="px-4 py-3">
                      <StarRating value={r.value} size="size-4" />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.updatedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StoreOwnerDashboard;
