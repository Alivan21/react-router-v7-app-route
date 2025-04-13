import { loginSchema, TLoginRequest } from "./schema";
import { TLoginResponse } from "./type";

const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    role: "user",
  },
  { id: "2", email: "admin@example.com", password: "admin12345", role: "admin" },
];

const generateMockToken = (email: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      id: MOCK_USERS.find((user) => user.email === email)?.id,
      sub: email,
      name: email.split("@")[0],
      role: email.includes("admin") ? "admin" : "user",
      exp: Math.floor(Date.now() / 1000) + 604800, // 1 week expiry
    })
  );
  const signature = btoa("mock_signature");

  return `${header}.${payload}.${signature}`;
};

export const login = async (credentials: TLoginRequest): Promise<TLoginResponse> => {
  const validationResult = loginSchema.safeParse(credentials);
  if (!validationResult.success) {
    throw new Error("Invalid login credentials");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  const response: TLoginResponse = {
    data: {
      token: generateMockToken(credentials.email),
      type: "Bearer",
      expires_at: expiryDate.toISOString(),
    },
    message: "Login successful",
    timestamp: new Date().toISOString(),
  };

  return response;
};

export const logout = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.resolve();
};
