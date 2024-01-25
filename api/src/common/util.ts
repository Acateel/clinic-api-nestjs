import { AppointmentTime } from './interface';

export const checkIntervalsOverlap = (
  first: AppointmentTime,
  second: AppointmentTime,
) =>
  first.startDate.getTime() >= second.startDate.getTime() &&
  first.endDate.getTime() <= second.endDate.getTime();

export const queue = () => {
  const a: any[] = [],
    b: any[] = [];
  return {
    push: (...elts) => a.push(...elts),
    shift: () => {
      if (b.length === 0) {
        while (a.length > 0) {
          b.push(a.pop());
        }
      }
      return b.pop();
    },
    get length() {
      return a.length + b.length;
    },
  };
};
