import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import App from "../../src/components/App/App";
import Counter from "../../src/components/Counter/Counter";
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

describe("Lesson 08 — liking recipes", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("auth-token", "test-token");
    stubFetch({
      "GET /users/me": mockUser,
      "GET /recipes": mockRecipes,
      "PUT /recipes/r1/likes": { ...mockRecipes[0], likes: ["u1"] },
    });
  });

  it("shows liked and unliked hearts based on recipe.likes", async () => {
    renderApp("/");

    await screen.findByText("Spaghetti Carbonara");
    // r1 has no likes; r2 is already liked by the mock user
    expect(screen.getByRole("button", { name: "Add to favorites" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove from favorites" })).toBeInTheDocument();
  });

  it("clicking the heart PUTs to the likes endpoint and fills the heart", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await screen.findByText("Spaghetti Carbonara");
    await user.click(screen.getByRole("button", { name: "Add to favorites" }));

    const unlikeButtons = await screen.findAllByRole("button", {
      name: "Remove from favorites",
    });
    expect(unlikeButtons).toHaveLength(2);
  });

  it("the favorites page shows only recipes liked by the current user", async () => {
    renderApp("/favorites");

    expect(await screen.findByText("Chicken Curry")).toBeInTheDocument();
    expect(screen.queryByText("Spaghetti Carbonara")).not.toBeInTheDocument();
  });

  it("counter displays the number of recipes liked by the current user", async () => {
    renderApp("/");

    // mockUser.likes = ["r2"], so the counter should show (1)
    expect(await screen.findByText("(1)")).toBeInTheDocument();
  });
});

describe("Lesson 08 — counter when logged out", () => {
  beforeEach(() => {
    localStorage.clear();
    stubFetch({});
  });

  it("counter shows (0) when user is not logged in", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Counter />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(await screen.findByText("(0)")).toBeInTheDocument();
  });
});
