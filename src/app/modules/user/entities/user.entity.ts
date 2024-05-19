import { BaseEntity, USER_ROLE_ENUM, transformer } from 'src/app/shared';
interface IUserConstructor {
  name: string;
  email: string;
  password: string;
  role: USER_ROLE_ENUM | string;
  isEnabled?: boolean;
  firstAccess?: boolean;
  id?: number;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICreateCoachConstructor
  extends Pick<IUserConstructor, 'name' | 'email'> {}

export class UserEntity extends BaseEntity {
  private name: string;
  private email: string;
  private password: string;
  private role: USER_ROLE_ENUM;
  private isEnabled = true;
  private firstAccess = false;

  constructor({
    name,
    email,
    password,
    role,
    isEnabled = true,
    firstAccess = false,
    id,
    uuid,
    createdAt,
    updatedAt,
  }: IUserConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.password = password;
    this.role = role as USER_ROLE_ENUM;
    this.isEnabled = isEnabled;
    this.firstAccess = firstAccess;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getFirstAccess(): boolean {
    return this.firstAccess;
  }

  public getRole(): USER_ROLE_ENUM {
    return this.role;
  }
}
