import { BaseEntity, type IBaseConstructor } from 'src/app/shared';

interface WellBeingConstructor extends IBaseConstructor {
  athleteId: number;
  date: Date;
  sleep: number;
  disposition: number;
  musclePain: number;
  stress: number;
  humor: number;
}

export class CaptureWellBeing extends BaseEntity {
  private athleteId: number;
  private date: Date;
  private sleep: number;
  private disposition: number;
  private musclePain: number;
  private stress: number;
  private humor: number;

  constructor({
    athleteId,
    date,
    sleep,
    disposition,
    musclePain,
    stress,
    humor,
    id,
    uuid,
    createdAt,
    updateAt,
  }: WellBeingConstructor) {
    super(id, uuid, createdAt, updateAt);
    this.athleteId = athleteId;
    this.date = date;
    this.sleep = sleep;
    this.disposition = disposition;
    this.musclePain = musclePain;
    this.stress = stress;
    this.humor = humor;
  }

  public getAthleteId(): number {
    return this.athleteId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getSleep(): number {
    return this.sleep;
  }
  public getDisposition(): number {
    return this.disposition;
  }
  public getMusclePain(): number {
    return this.musclePain;
  }
  public getStress(): number {
    return this.stress;
  }
  public getHumor(): number {
    return this.humor;
  }
}
