export interface IScheduleRepository {
  sendCreateUserEmail(): Promise<void>;
}
