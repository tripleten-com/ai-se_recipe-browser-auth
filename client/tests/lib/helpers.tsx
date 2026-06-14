import { vi } from "vitest";
import type { CurrentUser, Recipe } from "../../src/types";

export const mockUser: CurrentUser = {
  userId: "u1",
  name: "Pat",
  email: "pat@example.com",
  likes: ["r2"],
};

export const mockRecipes: Recipe[] = [
  {
    id: "r1",
    title: "Spaghetti Carbonara",
    category: "Italian",
    description: "A classic Roman pasta",
    image: "",
    content: "Cook the pasta.",
    likes: [],
  },
  {
    id: "r2",
    title: "Chicken Curry",
    category: "Indian",
    description: "A fragrant curry",
    image: "",
    content: "Simmer the curry.",
    likes: ["u1"],
  },
];

type RouteValue = unknown | ((options: RequestInit) => unknown);

/**
 * Stubs global fetch with a route-table mock. Keys are "<METHOD> <path>"
 * (e.g. "POST /auth/login"); values are the `data` payload to respond with,
 * or a function of the request options that returns it. Unmatched requests
 * get a non-ok response. Returns the mock so tests can inspect calls.
 */
export function stubFetch(routes: Record<string, RouteValue> = {}) {
  const mock = vi.fn((input: RequestInfo | URL, options: RequestInit = {}) => {
    const url = String(input);
    const method = (options.method ?? "GET").toUpperCase();
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    const key = `${method} ${path}`;
    if (key in routes) {
      const value = routes[key];
      const data = typeof value === "function" ? value(options) : value;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data }),
      } as Response);
    }
    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: `No mock for ${key}` }),
    } as Response);
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}
