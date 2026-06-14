import type { Recipe, CurrentUser } from "../types";

const BASE_URL = "http://localhost:3001";

function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("auth-token") ?? "";

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res
          .json()
          .then((err) =>
            Promise.reject(new Error(err.message || "Request failed")),
          );
      }
      return res.json();
    })
    .then((body) => body.data);
}

export function getRecipes(): Promise<Recipe[]> {
  return request<Recipe[]>(`${BASE_URL}/recipes`);
}

export function getRecipe(id: string): Promise<Recipe> {
  return request<Recipe>(`${BASE_URL}/recipes/${id}`);
}

export function toggleLike(id: string): Promise<Recipe> {
  return request<Recipe>(`${BASE_URL}/recipes/${id}/likes`, { method: "PUT" });
}

export function loginUser(
  email: string,
  password: string,
): Promise<{ token: string; user: CurrentUser }> {
  return request(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ user: CurrentUser }> {
  return request(`${BASE_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}
