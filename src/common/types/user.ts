import { JwtPayload } from "@/utils/jwt";

export type UserData = JwtPayload & {
  id: string;
  email: string;
  name: string;
  role: string;
};
