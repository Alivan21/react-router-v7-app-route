import { JwtPayload } from "@/utils/jwt";

export interface UserData extends JwtPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}
