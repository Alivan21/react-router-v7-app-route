import { loginSchema, TLoginRequest } from "./schema";
import { TLoginResponse } from "./type";

/**
 * Mock user database
 */
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    role: "user",
  },
  { id: "2", email: "admin@example.com", password: "admin12345", role: "admin" },
];

/**
 * Generate a mock JWT token
 */
const generateMockToken = (email: string): string => {
  // This is a simplified mock token - don't use this pattern in production
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

/**
 * Mock login function that validates credentials and returns a JWT token
 */
export const login = async (credentials: TLoginRequest): Promise<TLoginResponse> => {
  // Validate request schema
  const validationResult = loginSchema.safeParse(credentials);
  if (!validationResult.success) {
    throw new Error("Invalid login credentials");
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if user exists (mock authentication)
  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Generate token expiry (7 days from now)
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);

  // Create response matching TLoginResponse type
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

/**
 * Mock logout function
 */
export const logout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // In a real implementation, you would invalidate the token on the server
  // This is a no-op in the mock implementation
  return Promise.resolve();
};
