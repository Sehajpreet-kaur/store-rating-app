import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { fetchUserDetails, clearSelectedUser } from "../../store/admin/index.js";

const roleLabels = {
  admin: "System Administrator",
  store_owner: "Store Owner",
  normal: "Normal User",
};

function AdminUserDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedUser, selectedUserLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUserDetails(id));
    return () => dispatch(clearSelectedUser());
  }, [dispatch, id]);

  return (
    <div className="max-w-lg space-y-6">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to users
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">User Details</h1>
      </div>

      {selectedUserLoading || !selectedUser ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-xl border border-border bg-card p-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{selectedUser.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm text-foreground">{selectedUser.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Address
              </dt>
              <dd className="mt-1 text-sm text-foreground">{selectedUser.address || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {roleLabels[selectedUser.role] || selectedUser.role}
              </dd>
            </div>
            {selectedUser.role === "store_owner" && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Store Rating
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <Star className="size-4 fill-current" />
                  {selectedUser.rating ?? "No ratings yet"}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}

export default AdminUserDetails;
