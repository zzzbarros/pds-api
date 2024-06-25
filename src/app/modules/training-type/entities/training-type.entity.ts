import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface IConstructor extends IBaseConstructor {
  name: string;
  isEnabled?: boolean;
}

export class TrainingTypeEntity extends BaseEntity {
  private name: string;
  private isEnabled: boolean;

  constructor({
    name,
    isEnabled = true,
    id,
    uuid,
    createdAt,
    updateAt,
  }: IConstructor) {
    super(id, uuid, createdAt, updateAt);
    this.name = name;
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

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }
}
