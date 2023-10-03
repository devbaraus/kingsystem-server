import { UserDto } from "./user.dto";

export class AuthDto {
  access_token: string;
  user: UserDto;
}
