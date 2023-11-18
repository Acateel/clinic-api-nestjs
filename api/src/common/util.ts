import { AppointmentTime } from './interface';

export const checkIntervalsOverlap = (
  first: AppointmentTime,
  second: AppointmentTime,
) =>
  first.startDate.getTime() >= second.startDate.getTime() &&
  first.endDate.getTime() <= second.endDate.getTime();
