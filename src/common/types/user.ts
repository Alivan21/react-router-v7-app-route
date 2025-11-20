import { JwtPayload } from "@/common/utils/jwt";

export type TUserData = JwtPayload & {
  id: string;
  email: string;
  name: string;
  role: string;
};
