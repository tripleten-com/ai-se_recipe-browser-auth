import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "../../src/contexts/AuthContext";
import Header from "../../src/components/Header/Header";
import { mockUser, stubFetch } from "./helpers";

/** Reports the auth state, including the loading phase. */
function Probe() {
  const { isLoading, isAuthenticated, currentUser } = useAuth();
  if (isLoading) return <p>loading</p>;
  return (
    <p>
      {isAuthenticated ? `signed in as ${currentUser?.name}` : "signed out"}
    </p>
  );
}

function renderProbe() {
  return render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

describe("Lesson 07 — restoring the session on startup", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores the session when a valid token is stored", async () => {
    localStorage.setItem("auth-token", "stored-token");
    const fetchMock = stubFetch({ "GET /users/me": mockUser });

    renderProbe();

    expect(await screen.findByText("signed in as Pat")).toBeInTheDocument();
    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/users/me"),
    );
    expect(call).toBeDefined();
  });

  it("clears an invalid token and stays signed out", async () => {
    localStorage.setItem("auth-token", "expired-token");
    stubFetch(); // every request, including /users/me, fails

    renderProbe();

    expect(await screen.findByText("signed out")).toBeInTheDocument();
    expect(localStorage.getItem("auth-token")).toBeNull();
  });

  it("does not call the API when no token is stored", async () => {
    const fetchMock = stubFetch();

    renderProbe();

    expect(await screen.findByText("signed out")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("the header displays Login/Register links only when unauthenticated", async () => {
    stubFetch();

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(
      await screen.findByRole("link", { name: /login/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });

  it("the header displays a logout button and username only when authenticated", async () => {
    localStorage.setItem("auth-token", "test-token");
    stubFetch({ "GET /users/me": mockUser });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Header />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(await screen.findByText("Pat")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log\s?out/i }),
    ).toBeInTheDocument();
  });
});
