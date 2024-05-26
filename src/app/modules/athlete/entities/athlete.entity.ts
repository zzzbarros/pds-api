import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface IConstructor extends IBaseConstructor {
  name: string;
  email: string;
  birthday: Date;
  weight?: number;
  height?: number;
  isEnabled?: boolean;
}

export class AthleteEntity extends BaseEntity {
  private name: string;
  private email: string;
  private birthday: Date;
  private weight?: number;
  private height?: number;
  private isEnabled = true;

  constructor({
    name,
    email,
    birthday,
    weight,
    height,
    isEnabled = true,
    id,
    uuid,
    createdAt,
    updateAt,
  }: IConstructor) {
    super(id, uuid, createdAt, updateAt);
    this.name = name;
    this.email = email;
    this.birthday = birthday;
    this.weight = weight;
    this.height = height;
    this.isEnabled = isEnabled;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getBirthday(): Date {
    return this.birthday;
  }

  getWeight(): number {
    return this.weight;
  }

  getHeight(): number {
    return this.height;
  }

  getIsEnabled(): boolean {
    return this.isEnabled;
  }
}
