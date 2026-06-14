import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import LoginPage from "../../src/pages/LoginPage";
import RegisterPage from "../../src/pages/RegisterPage";
import { mockUser, stubFetch } from "./helpers";

/** Shows the current pathname so tests can assert on navigation. */
function LocationProbe() {
  const location = useLocation();
  return <p data-testid="location">{location.pathname}</p>;
}

function renderAt(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <LocationProbe />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<p>home page stub</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

async function fillAndSubmit(
  container: HTMLElement,
  values: Record<string, string>,
) {
  const user = userEvent.setup();
  for (const [selector, value] of Object.entries(values)) {
    await user.type(
      container.querySelector(selector) as HTMLInputElement,
      value,
    );
  }
  await user.click(screen.getByRole("button"));
}

describe("Lesson 04 — login and registration flows", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submitting the login form POSTs to /auth/login with the credentials", async () => {
    const fetchMock = stubFetch({
      "POST /auth/login": { token: "test-token", user: mockUser },
    });
    const { container } = renderAt("/login");

    await fillAndSubmit(container, {
      'input[type="email"]': "pat@example.com",
      'input[type="password"]': "longenough",
    });

    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/auth/login"),
    );
    expect(call).toBeDefined();
    const body = JSON.parse(String(call![1]!.body));
    expect(body.email).toBe("pat@example.com");
    expect(body.password).toBe("longenough");
  });

  it("a successful login stores the token and navigates home", async () => {
    stubFetch({ "POST /auth/login": { token: "test-token", user: mockUser } });
    const { container } = renderAt("/login");

    await fillAndSubmit(container, {
      'input[type="email"]': "pat@example.com",
      'input[type="password"]': "longenough",
    });

    expect(await screen.findByText("home page stub")).toBeInTheDocument();
    expect(localStorage.getItem("auth-token")).toBe("test-token");
  });

  it("a successful registration POSTs to /auth/register and navigates to /login", async () => {
    const fetchMock = stubFetch({
      "POST /auth/register": {
        userId: mockUser.userId,
        name: mockUser.name,
        email: mockUser.email,
      },
    });
    const { container } = renderAt("/register");

    await fillAndSubmit(container, {
      'input[name="name"]': "Pat",
      'input[type="email"]': "pat@example.com",
      'input[type="password"]': "longenough",
    });

    const call = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/auth/register"),
    );
    expect(call).toBeDefined();
    expect(call![1]!.method).toBe("POST");

    await waitFor(() =>
      expect(screen.getByTestId("location")).toHaveTextContent("/login"),
    );
  });
});
