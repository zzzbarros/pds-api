import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface IConstructor extends IBaseConstructor {
  name: string;
  coachId: number;
  isEnabled?: boolean;
}

export class TrainingTypeEntity extends BaseEntity {
  private name: string;
  private isEnabled: boolean;
  private coachId: number;

  constructor({
    name,
    coachId,
    isEnabled = true,
    id,
    uuid,
    createdAt,
    updateAt,
  }: IConstructor) {
    super(id, uuid, createdAt, updateAt);
    this.name = name;
    this.coachId = coachId;
    this.isEnabled = isEnabled;
  }

  public update({ name }: Pick<IConstructor, 'name'>) {
    this.name = name;
  }

  public toggleIsEnabled(): void {
    this.isEnabled = !this.isEnabled;
  }

  public getName(): string {
    return this.name;
  }

  public getCoachId(): number {
    return this.coachId;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }
}
