import { useFormWithValidation } from "../hooks/useFormWithValidation";

export default function RegisterPage() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    // submit logic here
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
    </form>
  );
}
