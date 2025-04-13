import {
  TUserItem,
  TUserResponse,
  TUserListResponse,
  TUserApiResponse,
  TUserQueryParams,
} from "./type";

const mockUsers: TUserItem[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    phone_number: "+1234567890",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    deleted_at: null,
    status: "active",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    phone_number: "+1987654321",
    created_at: "2023-01-02T00:00:00Z",
    updated_at: "2023-01-02T00:00:00Z",
    deleted_at: null,
    status: "inactive",
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    name: "Bob Johnson",
    phone_number: "+1122334455",
    created_at: "2023-01-03T00:00:00Z",
    updated_at: "2023-01-03T00:00:00Z",
    deleted_at: null,
    status: "active",
  },
  {
    id: "4",
    email: "alice.cooper@example.com",
    name: "Alice Cooper",
    phone_number: "+1233456789",
    created_at: "2023-01-04T00:00:00Z",
    updated_at: "2023-01-04T00:00:00Z",
    deleted_at: null,
    status: "inactive",
  },
  {
    id: "5",
    email: "michael.chen@example.com",
    name: "Michael Chen",
    phone_number: "+1344567890",
    created_at: "2023-01-05T00:00:00Z",
    updated_at: "2023-01-05T00:00:00Z",
    deleted_at: null,
    status: "active",
  },
  {
    id: "6",
    email: "sarah.wilson@example.com",
    name: "Sarah Wilson",
    phone_number: "+1455678901",
    created_at: "2023-01-06T00:00:00Z",
    updated_at: "2023-01-06T00:00:00Z",
    deleted_at: null,
    status: "inactive",
  },
  {
    id: "7",
    email: "david.garcia@example.com",
    name: "David Garcia",
    phone_number: "+1566789012",
    created_at: "2023-01-07T00:00:00Z",
    updated_at: "2023-01-07T00:00:00Z",
    deleted_at: null,
    status: "active",
  },
  {
    id: "8",
    email: "emma.rodriguez@example.com",
    name: "Emma Rodriguez",
    phone_number: "+1677890123",
    created_at: "2023-01-08T00:00:00Z",
    updated_at: "2023-01-08T00:00:00Z",
    deleted_at: null,
    status: "inactive",
  },
  {
    id: "9",
    email: "james.taylor@example.com",
    name: "James Taylor",
    phone_number: "+1788901234",
    created_at: "2023-01-09T00:00:00Z",
    updated_at: "2023-01-09T00:00:00Z",
    deleted_at: null,
    status: "active",
  },
  {
    id: "10",
    email: "olivia.anderson@example.com",
    name: "Olivia Anderson",
    phone_number: "+1899012345",
    created_at: "2023-01-10T00:00:00Z",
    updated_at: "2023-01-10T00:00:00Z",
    deleted_at: null,
    status: "inactive",
  },
];

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(params: TUserQueryParams): Promise<TUserListResponse> {
  await delay(500);

  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedUsers = mockUsers
    .filter((user) => user.deleted_at === null)
    .slice(startIndex, endIndex);

  return {
    message: "Users retrieved successfully",
    data: paginatedUsers,
    timestamp: new Date().toISOString(),
    meta: {
      total: mockUsers.length,
      page: page,
      limit: limit,
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

export async function getUserById(id: string): Promise<TUserResponse> {
  await delay(300);

  const user = mockUsers.find((user) => user.id === id && user.deleted_at === null);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    data: user,
    timestamp: new Date().toISOString(),
    message: "User retrieved successfully",
  };
}

export async function createUser(
  userData: Omit<TUserItem, "id" | "created_at" | "updated_at" | "deleted_at">
): Promise<TUserResponse> {
  await delay(700);

  const now = new Date().toISOString();
  const newUser: TUserItem = {
    id: `${mockUsers.length + 1}`,
    ...userData,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  mockUsers.push(newUser);

  return {
    data: newUser,
    timestamp: new Date().toISOString(),
    message: "User created successfully",
  };
}

export async function updateUser(
  id: string,
  userData: Partial<Omit<TUserItem, "id" | "created_at" | "updated_at" | "deleted_at">>
): Promise<TUserResponse> {
  await delay(600);

  const userIndex = mockUsers.findIndex((user) => user.id === id && user.deleted_at === null);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const now = new Date().toISOString();
  const updatedUser: TUserItem = {
    ...mockUsers[userIndex],
    ...userData,
    updated_at: now,
  };

  mockUsers[userIndex] = updatedUser;

  return {
    data: updatedUser,
    timestamp: new Date().toISOString(),
    message: "User updated successfully",
  };
}

export async function deleteUser(id: string): Promise<TUserApiResponse> {
  await delay(400);

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
    timestamp: new Date().toISOString(),
    data: null,
    message: "User deleted successfully",
  };
}
