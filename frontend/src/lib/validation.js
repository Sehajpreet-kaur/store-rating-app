// Client-side mirrors of the backend rules (the backend remains the source of truth).
export const rules = {
  name: (v = "") =>
    v.trim().length < 20 || v.trim().length > 60 ? "Name must be between 20 and 60 characters" : "",
  email: (v = "") => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email"),
  address: (v = "") => (v.length > 400 ? "Address must be at most 400 characters" : ""),
  password: (v = "") => {
    if (v.length < 8 || v.length > 16) return "Password must be 8-16 characters";
    if (!/[A-Z]/.test(v)) return "Password must include at least one uppercase letter";
    if (!/[^A-Za-z0-9]/.test(v)) return "Password must include at least one special character";
    return "";
  },
  required: (label) => (v = "") => (v ? "" : `${label} is required`),
};

// schema: { fieldName: ruleFn }  ->  { fieldName: "error message" } (empty object = valid)
export function validate(formData, schema) {
  const errors = {};
  for (const [field, rule] of Object.entries(schema)) {
    const msg = rule(formData[field] ?? "");
    if (msg) errors[field] = msg;
  }
  return errors;
}
