import { UserRole } from 'src/app/shared';

class UserLoginResponse {
  name: string;
  type: UserRole;
  uuid: string;
}

export class UserCredentialsResponseDto {
  user: UserLoginResponse;
}
