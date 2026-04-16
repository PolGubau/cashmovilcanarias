import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, formatDateTime } from "../utils";

describe("cn", () => {
  it("merges classes correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "shown")).toBe("base shown");
  });

  it("handles undefined/null gracefully", () => {
    expect(cn(undefined, null, "valid")).toBe("valid");
  });
});

describe("formatCurrency", () => {
  it("formats a positive number as EUR", () => {
    const result = formatCurrency(100);
    expect(result).toContain("100");
    expect(result).toMatch(/€|EUR/);
  });

  it("handles null/undefined as 0", () => {
    const result = formatCurrency(null);
    expect(result).toContain("0");
  });

  it("handles string numbers", () => {
    const result = formatCurrency("250.50");
    expect(result).toContain("250");
  });

  it("formats decimal values", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("1");
    expect(result).toMatch(/€|EUR/);
  });
});

describe("formatDate", () => {
  it("returns dash for null", () => {
    expect(formatDate(null)).toBe("—");
  });

  it("returns dash for undefined", () => {
    expect(formatDate(undefined)).toBe("—");
  });

  it("formats a valid date string", () => {
    const result = formatDate("2026-04-16");
    // es-ES locale: dd/mm/yyyy
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(result).toContain("2026");
  });
});

describe("formatDateTime", () => {
  it("returns dash for null", () => {
    expect(formatDateTime(null)).toBe("—");
  });

  it("formats a valid datetime string with hours and minutes", () => {
    const result = formatDateTime("2026-04-16T15:30:00Z");
    expect(result).toContain("2026");
    expect(result).toMatch(/\d{2}:\d{2}/);
  });
});
