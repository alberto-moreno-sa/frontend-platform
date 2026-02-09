import { loginFormSchema, registerFormSchema } from "./validators";

describe("loginFormSchema", () => {
  it("accepts valid login data", () => {
    const result = loginFormSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = loginFormSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = loginFormSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginFormSchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerFormSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = registerFormSchema.safeParse({
      name: "J",
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name longer than 100 characters", () => {
    const result = registerFormSchema.safeParse({
      name: "A".repeat(101),
      email: "john@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = registerFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Pass1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase letter", () => {
    const result = registerFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without lowercase letter", () => {
    const result = registerFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "PASSWORD1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password without a number", () => {
    const result = registerFormSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "Passwordd",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerFormSchema.safeParse({
      name: "John Doe",
      email: "invalid",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });
});
