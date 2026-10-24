import { describe, expect, it } from "vitest";
import { hmToMinutes, minutesToHm } from "./time";

describe("time helpers", () => {
  it("converts minutes to HH:mm", () => {
    expect(minutesToHm(480)).toBe("08:00");
    expect(minutesToHm(0)).toBe("00:00");
    expect(minutesToHm(1080)).toBe("18:00");
  });

  it("converts HH:mm to minutes", () => {
    expect(hmToMinutes("08:00")).toBe(480);
    expect(hmToMinutes("18:00")).toBe(1080);
  });
});
