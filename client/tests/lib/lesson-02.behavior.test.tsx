import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext";
import { mockUser, stubFetch } from "./helpers";

/** Exercises the auth context the way any consumer component would. */
function Probe() {
  const { isAuthenticated, currentUser, login, logout } = useAuth();
  return (
    <div>
      <p>
        {isAuthenticated ? `signed in as ${currentUser?.name}` : "signed out"}
      </p>
      <button onClick={() => login("test-token", mockUser)}>do login</button>
      <button onClick={() => logout()}>do logout</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

describe("Lesson 02 — AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    stubFetch();
  });

  it("starts signed out", async () => {
    renderProbe();
    expect(await screen.findByText("signed out")).toBeInTheDocument();
  });

  it("login sets the current user and stores the token", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(await screen.findByRole("button", { name: "do login" }));

    expect(await screen.findByText("signed in as Pat")).toBeInTheDocument();
    expect(localStorage.getItem("auth-token")).toBe("test-token");
  });

  it("logout clears the user and removes the token", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(await screen.findByRole("button", { name: "do login" }));
    await user.click(screen.getByRole("button", { name: "do logout" }));

    expect(await screen.findByText("signed out")).toBeInTheDocument();
    expect(localStorage.getItem("auth-token")).toBeNull();
  });
});
