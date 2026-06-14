import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormWithValidation } from "../hooks/useFormWithValidation";
import { registerUser } from "../utils/api";

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState("");
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    try {
      await registerUser(values.name, values.email, values.password);
      navigate("/login");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h1 className="form__title">Register</h1>
      <div className="form__input-container">
        <label className="form__label">
          Name
          <input
            className="form__input"
            name="name"
            type="name"
            required
            minLength={2}
            maxLength={40}
            value={values.name ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.name && <p className="form__error">{errors.name}</p>}
      </div>
      <div className="form__input-container">
        <label className="form__label">
          Email
          <input
            className="form__input"
            name="email"
            type="email"
            required
            value={values.email ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.email && <p className="form__error">{errors.email}</p>}
      </div>
      <div className="form__input-container">
        <label className="form__label">
          Password
          <input
            className="form__input"
            name="password"
            type="password"
            required
            minLength={8}
            value={values.password ?? ""}
            onChange={handleChange}
          />
        </label>
        {errors.password && <p className="form__error">{errors.password}</p>}
      </div>
      <button type="submit" disabled={!isValid} className="form__submit-btn">
        Submit
      </button>
      {submitError && <p className="form__error">{submitError}</p>}
    </form>
  );
}
