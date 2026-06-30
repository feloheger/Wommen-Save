import { formatDuration, getInitials, getAvatarColor } from "@utils/formatters";

describe("formatters", () => {
  it("formatiert Sekunden korrekt zu mm:ss", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(5)).toBe("0:05");
    expect(formatDuration(600)).toBe("10:00");
  });

  it("erzeugt Initialen aus einem Namen", () => {
    expect(getInitials("Anna Müller")).toBe("AM");
    expect(getInitials("Lea")).toBe("L");
  });

  it("gibt für gleiche Eingaben dieselbe Avatarfarbe zurück", () => {
    const colorA = getAvatarColor("Anna");
    const colorB = getAvatarColor("Anna");
    expect(colorA).toBe(colorB);
  });
});
