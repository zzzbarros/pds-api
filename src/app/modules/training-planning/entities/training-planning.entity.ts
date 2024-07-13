import { BaseEntity, type IBaseConstructor } from 'src/app/shared';
import { TrainingTypeEntity } from '../../training-type';

interface ITrainingPlanning {
  athleteId: number;
  date: Date;
  trainingTypeId: number;
  duration: number;
  pse: number;
  description?: string;
  trainingType?: TrainingTypeEntity;
  finished?: boolean;
}

interface IConstructor extends IBaseConstructor, ITrainingPlanning {}

export class TrainingPlanningEntity extends BaseEntity {
  private athleteId: number;
  private date: Date;
  private trainingTypeId: number;
  private duration: number;
  private pse: number;
  private description?: string;
  private trainingType?: TrainingTypeEntity;
  private finished: boolean;

  constructor({
    athleteId,
    date,
    trainingTypeId,
    duration,
    pse,
    description,
    trainingType,
    id,
    uuid,
    createdAt,
    updateAt,
    finished = false,
  }: IConstructor) {
    super(id, uuid, createdAt, updateAt);
    this.athleteId = athleteId;
    this.date = date;
    this.trainingTypeId = trainingTypeId;
    this.duration = duration;
    this.description = description;
    this.pse = pse;
    this.trainingType = trainingType;
    this.finished = finished;
  }

  public update({
    date,
    duration,
    pse,
    description,
    trainingType,
  }: Omit<
    ITrainingPlanning,
    'athleteId' | 'trainingTypeId' | 'finished'
  >): void {
    this.date = date;
    this.duration = duration;
    this.description = description;
    this.pse = pse;
    this.trainingType = trainingType;
  }

  public updateTrainingTypeId(trainingTypeId: number) {
    this.trainingTypeId = trainingTypeId;
  }

  public getAthleteId(): number {
    return this.athleteId;
  }

  public getTrainingTypeId(): number {
    return this.trainingTypeId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getDescription(): string {
    return this.description;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getPSE(): number {
    return this.pse;
  }

  public getTrainingType(): TrainingTypeEntity {
    return this.trainingType;
  }

  public getLoad(): number {
    return this.duration * this.pse;
  }

  public getFinished(): boolean {
    return this.finished;
  }

  public finish() {
    this.finished = true;
  }
}
