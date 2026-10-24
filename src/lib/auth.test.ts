import { describe, expect, it } from "vitest";
import { authAwareHref, isPlayerAuthRequired, loginPath } from "./auth";

describe("isPlayerAuthRequired", () => {
  it("requires auth for all player dashboard routes", () => {
    expect(isPlayerAuthRequired("/player/home")).toBe(true);
    expect(isPlayerAuthRequired("/player/clubs")).toBe(true);
    expect(isPlayerAuthRequired("/player/bookings")).toBe(true);
    expect(isPlayerAuthRequired("/player/open-matches/new")).toBe(true);
  });

  it("does not require auth for public routes", () => {
    expect(isPlayerAuthRequired("/")).toBe(false);
    expect(isPlayerAuthRequired("/club/carthage")).toBe(false);
    expect(isPlayerAuthRequired("/login")).toBe(false);
  });
});

describe("authAwareHref", () => {
  it("returns path when authenticated", () => {
    expect(authAwareHref("/player/book/x", true)).toBe("/player/book/x");
  });

  it("returns login with next when guest", () => {
    expect(authAwareHref("/player/book/x", false)).toBe(
      loginPath("/player/book/x"),
    );
  });
});
