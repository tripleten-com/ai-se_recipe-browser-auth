import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import LoginPage from "../../src/pages/LoginPage";
import RegisterPage from "../../src/pages/RegisterPage";
import { stubFetch } from "./helpers";

function renderPage(page: React.ReactNode) {
  return render(
    <AuthProvider>
      <MemoryRouter>{page}</MemoryRouter>
    </AuthProvider>,
  );
}

/** The forms render exactly one button — the submit button. */
function submitButton() {
  return screen.getByRole("button");
}

function emailInput(container: HTMLElement) {
  return container.querySelector('input[type="email"]') as HTMLInputElement;
}

function passwordInput(container: HTMLElement) {
  return container.querySelector('input[type="password"]') as HTMLInputElement;
}

describe("Lesson 03 — form validation", () => {
  beforeEach(() => {
    localStorage.clear();
    stubFetch();
  });

  it("login submit button is disabled before any input", async () => {
    renderPage(<LoginPage />);
    expect(submitButton()).toBeDisabled();
  });

  // jsdom does not implement minLength (tooShort) validation, so the
  // invalid case uses a malformed email (typeMismatch) instead.
  it("login submit button stays disabled with an invalid email", async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<LoginPage />);

    await user.type(emailInput(container), "not-an-email");
    await user.type(passwordInput(container), "longenough");

    expect(submitButton()).toBeDisabled();
  });

  it("login submit button is enabled once email and password are valid", async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<LoginPage />);

    await user.type(emailInput(container), "pat@example.com");
    await user.type(passwordInput(container), "longenough");

    expect(submitButton()).toBeEnabled();
  });

  it("register submit button is enabled only when all fields are valid", async () => {
    const user = userEvent.setup();
    const { container } = renderPage(<RegisterPage />);

    expect(submitButton()).toBeDisabled();

    const nameInput = container.querySelector(
      'input[name="name"]',
    ) as HTMLInputElement;
    await user.type(nameInput, "Pat");
    await user.type(emailInput(container), "pat@example.com");
    await user.type(passwordInput(container), "longenough");

    expect(submitButton()).toBeEnabled();
  });
});
