import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import CommonForm from "../../common/form.jsx";
import { updatePasswordFormControls } from "../../config/index.js";
import { updatePassword } from "../../store/auth/index.js";
import { rules, validate } from "../../lib/validation.js";

const initialState = { oldPassword: "", newPassword: "", confirmPassword: "" };

const controls = [
  ...updatePasswordFormControls,
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    componentType: "input",
    type: "password",
    placeholder: "Re-enter your new password",
  },
];

function UpdatePassword() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  function onSubmit(event) {
    event.preventDefault();

    const found = validate(formData, {
      oldPassword: rules.required("Current password"),
      newPassword: rules.password,
    });
    if (!found.newPassword && formData.newPassword !== formData.confirmPassword) {
      found.confirmPassword = "Passwords do not match";
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    dispatch(updatePassword({ oldPassword: formData.oldPassword, newPassword: formData.newPassword }))
      .unwrap()
      .then((data) => {
        toast.success(data.message);
        setFormData(initialState);
      })
      .catch((err) => toast.error(err?.message || "Could not update password"));
  }

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Update Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          8-16 characters, with at least one uppercase letter and one special character.
        </p>
      </div>
      <CommonForm
        formControls={controls}
        buttonText={isLoading ? "Updating…" : "Update Password"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isBtnDisabled={isLoading}
        errors={errors}
      />
    </div>
  );
}

export default UpdatePassword;
