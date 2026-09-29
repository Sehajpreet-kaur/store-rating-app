import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Store, Star } from "lucide-react";
import { fetchDashboardStats } from "../../store/admin/index.js";

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "totalStores", label: "Total Stores", icon: Store },
  { key: "totalRatings", label: "Total Ratings", icon: Star },
];

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, statsLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of everything happening on the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-xl border border-border bg-card p-5 text-card-foreground"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">
              {statsLoading ? "…" : stats[key] ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
