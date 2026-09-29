import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import CommonForm from "../../common/form.jsx";
import { Label } from "../../components/ui/label.jsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../../components/ui/select.jsx";
import { addStoreFormControls } from "../../config/index.js";
import { createStore } from "../../store/admin/index.js";
import { fetchAllUsers } from "../../store/admin/index.js";
import { rules, validate } from "../../lib/validation.js";

const initialState = {
  name: "",
  email: "",
  address: "",
};

function AdminAddStore() {
  const [formData, setFormData] = useState(initialState);
  const [ownerId, setOwnerId] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSubmitting, users } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers({ role: "store_owner" }));
  }, [dispatch]);

  function onSubmit(event) {
    event.preventDefault();

    const found = validate(formData, { name: rules.name, email: rules.email, address: rules.address });
    setErrors(found);
    if (Object.keys(found).length) return;

    dispatch(createStore({ ...formData, ownerId: ownerId || undefined }))
      .unwrap()
      .then((data) => {
        toast.success(data.message || "Store created successfully");
        navigate("/admin/stores");
      })
      .catch((err) => {
        toast.error(err?.message || "Could not create store");
      });
  }

  return (
    <div className="max-w-md space-y-6">
      <Link
        to="/admin/stores"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to stores
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Store</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register a new store, optionally assigning an existing store owner.
        </p>
      </div>

      <div className="grid w-full gap-1.5">
        <Label className="mb-1">Store Owner (optional)</Label>
        <Select value={ownerId} onValueChange={setOwnerId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="No owner assigned" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-9999 bg-white">
            {users.length === 0 ? (
              <SelectItem value="" disabled>
                No store owners available yet
              </SelectItem>
            ) : (
              users.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name} ({u.email})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Only users with the Store Owner role are listed. You can also create the store
          first and assign an owner later.
        </p>
      </div>

      <CommonForm
        formControls={addStoreFormControls}
        buttonText={isSubmitting ? "Creating…" : "Create Store"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isSubmitting}
        errors={errors}
      />
    </div>
  );
}

export default AdminAddStore;
