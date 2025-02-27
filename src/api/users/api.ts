import { User, UserResponse, UserListResponse, UserApiResponse } from "./type";

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    phone_number: "+1234567890",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    deleted_at: null,
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    phone_number: "+1987654321",
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    deleted_at: null,
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    phone_number: "+1122334455",
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
    deleted_at: null,
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get a paginated list of users
 */
export async function getUsers(page: number = 1, limit: number = 10): Promise<UserListResponse> {
  await delay(500); // Simulate network delay

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = mockUsers
    .filter((user) => user.deleted_at === null)
    .slice(startIndex, endIndex);

  return {
    success: true,
    message: "Users retrieved successfully",
    data: paginatedUsers,
    timestamp: new Date().toISOString(),
    meta: {
      total: mockUsers.length,
      page,
      limit,
      total_page: Math.ceil(mockUsers.length / limit),
      has_next_page: endIndex < mockUsers.length,
      has_prev_page: startIndex > 0,
      first_page: page > 1 ? `?page=1&limit=${limit}` : undefined,
      last_page:
        endIndex < mockUsers.length
          ? `?page=${Math.ceil(mockUsers.length / limit)}&limit=${limit}`
          : undefined,
      next_page: endIndex < mockUsers.length ? `?page=${page + 1}&limit=${limit}` : undefined,
      prev_page: startIndex > 0 ? `?page=${page - 1}&limit=${limit}` : undefined,
      links: {
        first: page > 1 ? `?page=1&limit=${limit}` : undefined,
        last:
          endIndex < mockUsers.length
            ? `?page=${Math.ceil(mockUsers.length / limit)}&limit=${limit}`
            : undefined,
        next: endIndex < mockUsers.length ? `?page=${page + 1}&limit=${limit}` : undefined,
        prev: startIndex > 0 ? `?page=${page - 1}&limit=${limit}` : undefined,
      },
    },
  };
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string): Promise<UserResponse> {
  await delay(300); // Simulate network delay

  const user = mockUsers.find((user) => user.id === id && user.deleted_at === null);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
    message: "User retrieved successfully",
  };
}

/**
 * Create a new user
 */
export async function createUser(
  userData: Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">
): Promise<UserResponse> {
  await delay(700); // Simulate network delay

  const now = new Date().toISOString();
  const newUser: User = {
    id: `${mockUsers.length + 1}`,
    ...userData,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  mockUsers.push(newUser);

  return {
    success: true,
    data: newUser,
    timestamp: new Date().toISOString(),
    message: "User created successfully",
  };
}

/**
 * Update an existing user
 */
export async function updateUser(
  id: string,
  userData: Partial<Omit<User, "id" | "created_at" | "updated_at" | "deleted_at">>
): Promise<UserResponse> {
  await delay(600); // Simulate network delay

  const userIndex = mockUsers.findIndex((user) => user.id === id && user.deleted_at === null);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const now = new Date().toISOString();
  const updatedUser: User = {
    ...mockUsers[userIndex],
    ...userData,
    updated_at: now,
  };

  mockUsers[userIndex] = updatedUser;

  return {
    success: true,
    data: updatedUser,
    timestamp: new Date().toISOString(),
    message: "User updated successfully",
  };
}

/**
 * Delete a user (soft delete)
 */
export async function deleteUser(id: string): Promise<UserApiResponse> {
  await delay(400); // Simulate network delay

  const userIndex = mockUsers.findIndex((user) => user.id === id && user.deleted_at === null);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const now = new Date().toISOString();
  mockUsers[userIndex] = {
    ...mockUsers[userIndex],
    deleted_at: now,
  };

  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: null,
    message: "User deleted successfully",
  };
}
