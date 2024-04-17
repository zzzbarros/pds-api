import { BaseEntity, UserRole, transformer } from 'src/app/shared';

export class UserEntity extends BaseEntity {
  private name: string;
  private email: string;
  private password: string;
  private role: UserRole;
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
  }: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isEnabled?: boolean;
    firstAccess?: boolean;
    id?: number;
    uuid?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.nameToTitleCase(name);
    this.email = email;
    this.password = password;
    this.role = role;
    this.isEnabled = isEnabled;
    this.firstAccess = firstAccess;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getIsEnabled(): boolean {
    return this.isEnabled;
  }

  getFirstAccess(): boolean {
    return this.firstAccess;
  }

  getRole(): UserRole {
    return this.role;
  }
}
