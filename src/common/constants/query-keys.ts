export const QUERY_KEY = {
  USER: {
    LIST: "userList",
    DETAIL: (id: string) => ["userDetail", id] as const,
    OPTIONS: "userOptions",
  },
};
