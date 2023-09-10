import { AppointmentTime } from './interface';

export const checkIntervalsOverlap = (
  first: AppointmentTime,
  second: AppointmentTime,
) =>
  first.startDate.getTime() < second.endDate.getTime() &&
  first.endDate.getTime() > second.startDate.getTime();
