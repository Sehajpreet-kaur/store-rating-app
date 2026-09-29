import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import CommonForm from "../../common/form.jsx";
import { addUserFormControls } from "../../config/index.js";
import { createUser } from "../../store/admin/index.js";
import { rules, validate } from "../../lib/validation.js";

const initialState = {
  name: "",
  email: "",
  address: "",
  password: "",
  role: "normal",
};

function AdminAddUser() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSubmitting } = useSelector((state) => state.admin);

  function onSubmit(event) {
    event.preventDefault();

    const found = validate(formData, {
      name: rules.name,
      email: rules.email,
      address: rules.address,
      password: rules.password,
    });
    setErrors(found);
    if (Object.keys(found).length) return;

    dispatch(createUser(formData))
      .unwrap()
      .then((data) => {
        toast.success(data.message || "User created successfully");
        navigate("/admin/users");
      })
      .catch((err) => {
        toast.error(err?.message || "Could not create user");
      });
  }

  return (
    <div className="max-w-md space-y-6">
      <Link
        to="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to users
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add User</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a normal user, store owner, or another admin.
        </p>
      </div>

      <CommonForm
        formControls={addUserFormControls}
        buttonText={isSubmitting ? "Creating…" : "Create User"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isSubmitting}
        errors={errors}
      />
    </div>
  );
}

export default AdminAddUser;
