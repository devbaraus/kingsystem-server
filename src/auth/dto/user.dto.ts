import { User } from "@prisma/client";

export class UserDto implements Omit<User, "passwordHash"> {
  name: string;
  email: string;
  id: number;
  updatedAt: Date;
  createdAt: Date;
}
