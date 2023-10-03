import { User } from "@prisma/client";

export class UserDto implements Omit<User, "passwordHash"> {
  email: string;
  id: number;
  name: string | null;
  updatedAt: Date;
  createdAt: Date;
}
