import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import App from "../../src/components/App/App";
import { mockUser, mockRecipes, stubFetch } from "./helpers";

function renderApp(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("Lesson 11 — httpOnly cookies", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores session via GET /users/me without a localStorage token", async () => {
    stubFetch({
      "GET /users/me": mockUser,
      "GET /recipes": mockRecipes,
    });
    renderApp("/");
    expect(localStorage.getItem("auth-token")).toBeNull();
    await screen.findByText("Spaghetti Carbonara");
  });

  it("every fetch call includes credentials: include", async () => {
    const fetchMock = stubFetch({
      "GET /users/me": mockUser,
      "GET /recipes": mockRecipes,
    });
    renderApp("/");
    await screen.findByText("Spaghetti Carbonara");
    for (const [, options] of fetchMock.mock.calls) {
      expect(options).toMatchObject({ credentials: "include" });
    }
  });

  it("login does not write auth-token to localStorage", async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    // No GET /users/me stub → starts unauthenticated → login page shown
    stubFetch({
      "POST /auth/login": { user: mockUser },
      "GET /recipes": mockRecipes,
    });
    renderApp("/login");
    await screen.findByRole("button", { name: /submit/i });
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(setItemSpy).not.toHaveBeenCalledWith("auth-token", expect.anything());
  });

  it("logout calls POST /auth/logout", async () => {
    const user = userEvent.setup();
    const fetchMock = stubFetch({
      "GET /users/me": mockUser,
      "GET /recipes": mockRecipes,
      "POST /auth/logout": {},
    });
    renderApp("/");
    await screen.findByText("Spaghetti Carbonara");
    await user.click(screen.getByRole("button", { name: /logout/i }));
    const logoutCall = fetchMock.mock.calls.find(([url]: [string]) =>
      url.includes("/auth/logout"),
    );
    expect(logoutCall).toBeDefined();
    expect(logoutCall[1]).toMatchObject({ method: "POST" });
  });
});
