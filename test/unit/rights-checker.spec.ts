import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import rightsChecker from "@/utils/rights-checker.ts";

const { useAuthMock } = vi.hoisted(() => ({ useAuthMock: vi.fn() }));

mockNuxtImport("useAuth", () => useAuthMock);

describe("rightsChecker", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return true when user is admin and no userId provided", () => {
    useAuthMock.mockReturnValue({
      authId: { value: "1" },
      authUser: { value: { role: "Admin" } },
    });

    expect(rightsChecker()).toBe(true);
  });

  it("should return false when user is not admin and no userId provided", () => {
    useAuthMock.mockReturnValue({
      authId: { value: "1" },
      authUser: { value: { role: "User" } },
    });

    expect(rightsChecker()).toBe(false);
  });

  it("should return true when userId matches authId", () => {
    useAuthMock.mockReturnValue({
      authId: { value: "123" },
      authUser: { value: { role: "User" } },
    });

    expect(rightsChecker("123")).toBe(true);
  });

  it("should return true when userId does not match but user is admin", () => {
    useAuthMock.mockReturnValue({
      authId: { value: "123" },
      authUser: { value: { role: "Admin" } },
    });

    expect(rightsChecker("999")).toBe(true);
  });

  it("should return false when userId does not match authId", () => {
    useAuthMock.mockReturnValue({
      authId: { value: "123" },
      authUser: { value: { role: "User" } },
    });

    expect(rightsChecker("12")).toBe(false);
  });

  it("should return false when authUser is null", () => {
    useAuthMock.mockReturnValue({
      authId: { value: null },
      authUser: { value: null },
    });

    expect(rightsChecker()).toBe(false);
  });
});
