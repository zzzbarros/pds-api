import { BaseEntity, IBaseConstructor } from 'src/app/shared';
import { TrainingEntity } from '../../training';

interface IConstructor extends IBaseConstructor {
  athleteId: number;
  week: string;
  startDate: Date;
  endDate: Date;
  weekLoad?: number;
  averageWeekLoad?: number;
  monotony?: number;
  chronic?: number;
  acute?: number;
  chronicAcute?: number;
  strain?: number;
  deviation?: number;
}

export class MonitoryEntity extends BaseEntity {
  private athleteId: number;
  private week: string;
  private startDate: Date;
  private endDate: Date;
  private weekLoad: number;
  private averageWeekLoad: number;
  private monotony: number;
  private chronic: number;
  private acute: number;
  private chronicAcute: number;
  private strain: number;
  private deviation: number;

  constructor({
    id,
    uuid,
    createdAt,
    updateAt,
    week,
    startDate,
    endDate,
    athleteId,
    weekLoad = 0,
    acute = 0,
    averageWeekLoad = 0,
    chronic = 0,
    chronicAcute = 0,
    deviation = 0,
    monotony = 0,
    strain = 0,
  }: IConstructor) {
    super(id, uuid, createdAt, updateAt);
    this.week = week;
    this.startDate = startDate;
    this.endDate = endDate;
    this.athleteId = athleteId;
    this.acute = acute;
    this.averageWeekLoad = averageWeekLoad;
    this.chronic = chronic;
    this.chronicAcute = chronicAcute;
    this.deviation = deviation;
    this.monotony = monotony;
    this.strain = strain;
    this.weekLoad = weekLoad;
  }

  public getAthleteId(): number {
    return this.athleteId;
  }

  public getWeek(): string {
    return this.week;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public getWeekLoad(): number {
    return this.weekLoad;
  }

  public getMonotony() {
    return this.monotony;
  }

  public getStrain() {
    return this.strain;
  }

  public getChronicAcute() {
    return this.chronicAcute;
  }

  public getChronic() {
    return this.chronic;
  }

  public getAcute() {
    return this.acute;
  }

  public getAverageWeekLoad() {
    return this.averageWeekLoad;
  }

  public getDeviation() {
    return this.deviation;
  }

  public calculate(
    weekTrainings: TrainingEntity[],
    previousMonitory: MonitoryEntity[],
  ) {
    this.weekLoad = this.calculateWeekLoad(weekTrainings);
    this.averageWeekLoad = this.calculateAverageWeekLoad();
    this.deviation = this.calculateDeviation(
      weekTrainings,
      this.averageWeekLoad,
    );
    this.monotony = this.calculateMonotony();
    this.chronic = this.calculateChronicLoad(previousMonitory);
    this.acute = this.weekLoad;
    this.chronicAcute = this.calculateChronicAcute();
    this.strain = this.calculateStrain();
    return {
      weekLoad: this.weekLoad,
      averageWeekLoad: this.averageWeekLoad,
      deviation: this.deviation,
      monotony: this.monotony,
      chronic: this.chronic,
      acute: this.acute,
      chronicAcute: this.chronicAcute,
      strain: this.strain,
    };
  }

  private calculateWeekLoad(weekTrainings: TrainingEntity[]) {
    return weekTrainings.reduce((acc, training) => acc + training.getLoad(), 0);
  }

  private calculateAverageWeekLoad() {
    const average = this.weekLoad / 7;
    return parseFloat(average.toFixed(1));
  }

  private calculateDeviation(
    weekTrainings: TrainingEntity[],
    averageWeekLoad: number,
  ): number {
    if (!weekTrainings.length) return 1000;

    const mean = averageWeekLoad;

    const squaredDifferences = weekTrainings.map((training) => {
      const load = training.getLoad();
      return Math.pow(load - mean, 2);
    });

    const sumSquaredDifferences = squaredDifferences.reduce(
      (acc, val) => acc + val,
      0,
    );

    if (weekTrainings.length <= 1) return 1000;

    const variance = sumSquaredDifferences / (weekTrainings.length - 1);

    const value = Math.sqrt(variance);

    return !isFinite(value) && value > 0 ? value : 1000;
  }

  private calculateMonotony() {
    const monotony = this.averageWeekLoad / this.deviation;
    return parseFloat(monotony.toFixed(1));
  }

  private calculateChronicLoad(previousMonitory: MonitoryEntity[]) {
    const numberOfWeeks = 4;
    const totalPreviousLoad = previousMonitory.reduce(
      (acc, weekMonitory) => acc + weekMonitory.getWeekLoad(),
      0,
    );
    if (!totalPreviousLoad) return 0;
    return totalPreviousLoad / numberOfWeeks;
  }

  private calculateChronicAcute() {
    if (!this.chronic) return 0;
    const chronicAcute = this.acute / this.chronic;
    return parseFloat(chronicAcute.toFixed(1));
  }

  private calculateStrain() {
    const strain = this.acute * this.monotony;
    return parseFloat(strain.toFixed(1));
  }
}
