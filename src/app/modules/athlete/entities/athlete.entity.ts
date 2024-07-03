import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface IConstructor extends IBaseConstructor {
  name: string;
  email: string;
  birthday: Date;
  coachId: number;
  weight?: number;
  height?: number;
  isEnabled?: boolean;
}

interface IUpdateConstructor
  extends Pick<
    IConstructor,
    'name' | 'email' | 'birthday' | 'weight' | 'height'
  > {}

export class AthleteEntity extends BaseEntity {
  private name: string;
  private email: string;
  private birthday: Date;
  private coachId: number;
  private weight?: number;
  private height?: number;
  private isEnabled = true;

  constructor({
    name,
    email,
    birthday,
    coachId,
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
    this.coachId = coachId;
    this.weight = weight;
    this.height = height;
    this.isEnabled = isEnabled;
  }

  public update({ name, email, birthday, weight, height }: IUpdateConstructor) {
    this.name = name;
    this.email = email;
    this.birthday = birthday;
    this.weight = weight;
    this.height = height;
  }

  public toggleIsEnabled() {
    this.isEnabled = !this.isEnabled;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getBirthday(): Date {
    return this.birthday;
  }

  public getCoachId(): number {
    return this.coachId;
  }

  public getWeight(): number {
    return this.weight;
  }

  public getHeight(): number {
    return this.height;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }
}
