import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getWarrantyStatus } from "../warranty";

describe("getWarrantyStatus", () => {
  beforeEach(() => {
    // Fix "now" to 2026-04-16T12:00:00Z
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-16T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns no-warranty when null", () => {
    const result = getWarrantyStatus(null);
    expect(result).toEqual({ active: false, label: "Sin garantía", daysLeft: null });
  });

  it("returns active warranty for a future date", () => {
    const futureDate = "2026-05-16T12:00:00Z"; // 30 days ahead
    const result = getWarrantyStatus(futureDate);
    expect(result.active).toBe(true);
    expect(result.daysLeft).toBe(30);
    expect(result.label).toContain("30 días");
  });

  it("returns expired warranty for a past date", () => {
    const pastDate = "2026-03-17T12:00:00Z"; // 30 days ago
    const result = getWarrantyStatus(pastDate);
    expect(result.active).toBe(false);
    expect(result.label).toContain("Caducó hace");
    expect(result.daysLeft).toBeLessThan(0);
  });

  it("returns 1 day left when expiry is tomorrow", () => {
    const tomorrow = "2026-04-17T12:00:00Z";
    const result = getWarrantyStatus(tomorrow);
    expect(result.active).toBe(true);
    expect(result.daysLeft).toBe(1);
  });
});
