import { contactSchema } from "@/utils/validation";

describe("contactSchema", () => {
  it("akzeptiert einen gültigen Kontakt und normalisiert die Nummer", () => {
    const r = contactSchema.safeParse({ name: "Lena", phone: "+49 151 2345678" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe("+491512345678");
  });

  it("lehnt zu kurze Namen ab", () => {
    expect(contactSchema.safeParse({ name: "L", phone: "+491512345678" }).success).toBe(false);
  });

  it("lehnt ungültige Nummern ab", () => {
    expect(contactSchema.safeParse({ name: "Lena", phone: "abc" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "Lena", phone: "123" }).success).toBe(false);
  });
});
