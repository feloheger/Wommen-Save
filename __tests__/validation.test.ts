import { loginSchema, registerSchema, contactSchema } from "@utils/validation";

describe("validation schemas", () => {
  it("validiert ein korrektes Login-Formular", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "123456" });
    expect(result.success).toBe(true);
  });

  it("lehnt eine ungültige E-Mail beim Login ab", () => {
    const result = loginSchema.safeParse({ email: "keine-email", password: "123456" });
    expect(result.success).toBe(false);
  });

  it("lehnt nicht übereinstimmende Passwörter bei der Registrierung ab", () => {
    const result = registerSchema.safeParse({
      name: "Anna",
      email: "anna@example.com",
      password: "123456",
      confirmPassword: "654321",
    });
    expect(result.success).toBe(false);
  });

  it("validiert einen korrekten Kontakt", () => {
    const result = contactSchema.safeParse({ name: "Lea", phone: "+491234567" });
    expect(result.success).toBe(true);
  });
});
