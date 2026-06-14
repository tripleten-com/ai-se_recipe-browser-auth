import { describe, it, expect, beforeEach } from "vitest";
import { getRecipes } from "../../src/utils/api";
import { stubFetch } from "./helpers";

describe("Lesson 05 — Authorization header", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("attaches a Bearer token to requests when one is stored", async () => {
    localStorage.setItem("auth-token", "test-token");
    const fetchMock = stubFetch({ "GET /recipes": [] });

    await getRecipes();

    const headers = fetchMock.mock.calls[0][1]!.headers as Record<
      string,
      string
    >;
    expect(headers.Authorization).toBe("Bearer test-token");
  });

  it("sends an empty Bearer token when no token is stored", async () => {
    const fetchMock = stubFetch({ "GET /recipes": [] });

    await getRecipes();

    const headers = fetchMock.mock.calls[0][1]!.headers as Record<
      string,
      string
    >;
    expect(headers.Authorization).toBe("Bearer ");
  });
});
