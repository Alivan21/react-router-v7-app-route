import type { TUserQueryParams } from "@/api/users/type";

export const QUERY_KEY = {
  USER: {
    ALL: () => ["users"],
    LIST: (params?: TUserQueryParams) => [...QUERY_KEY.USER.ALL(), "list", params],
    DETAIL: (id?: string) => [...QUERY_KEY.USER.ALL(), "detail", id],
    OPTIONS: (params?: TUserQueryParams) => [...QUERY_KEY.USER.ALL(), "options", params],
  },
};
