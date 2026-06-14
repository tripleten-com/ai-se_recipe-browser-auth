import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext";
import {
  ProtectedRoute,
  PublicRoute,
} from "../../src/components/ProtectedRoute/ProtectedRoute";
import { mockUser, stubFetch } from "./helpers";

/** Shows the current pathname so tests can assert on redirects. */
function LocationProbe() {
  const location = useLocation();
  return <p data-testid="location">{location.pathname}</p>;
}

/** Rendered outside the routes so it is clickable regardless of redirects. */
function LoginTrigger() {
  const { login } = useAuth();
  return (
    <button onClick={() => login("test-token", mockUser)}>force login</button>
  );
}

function renderAt(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <LoginTrigger />
        <LocationProbe />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<p>login page stub</p>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>protected home stub</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("Lesson 06 — route protection", () => {
  beforeEach(() => {
    localStorage.clear();
    stubFetch();
  });

  it("redirects unauthenticated visitors from a protected route to /login", async () => {
    renderAt("/");

    expect(await screen.findByText("login page stub")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/login");
    expect(screen.queryByText("protected home stub")).not.toBeInTheDocument();
  });

  it("shows public routes to unauthenticated visitors", async () => {
    renderAt("/login");

    expect(await screen.findByText("login page stub")).toBeInTheDocument();
  });

  it("redirects authenticated users away from public routes and shows protected content", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await screen.findByText("login page stub");
    await user.click(screen.getByRole("button", { name: "force login" }));

    expect(await screen.findByText("protected home stub")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/");
    expect(screen.queryByText("login page stub")).not.toBeInTheDocument();
  });
});
