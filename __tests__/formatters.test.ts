import { formatClock, getInitial, normalizePhone } from "@/utils/formatters";

describe("formatters", () => {
  it("formatiert Sekunden als m:ss", () => {
    expect(formatClock(65)).toBe("1:05");
    expect(formatClock(5)).toBe("0:05");
    expect(formatClock(600)).toBe("10:00");
    expect(formatClock(-3)).toBe("0:00");
  });

  it("liefert den Anfangsbuchstaben", () => {
    expect(getInitial("lena")).toBe("L");
    expect(getInitial("  ")).toBe("?");
  });

  it("normalisiert Telefonnummern", () => {
    expect(normalizePhone("+49 (151) 234-5678")).toBe("+491512345678");
    expect(normalizePhone("0151 2345678")).toBe("01512345678");
  });
});
