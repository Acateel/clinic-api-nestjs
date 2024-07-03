export class NotifyAppointmentUpcommingEvent {
  static readonly EVENT_NAME = 'notification.appointmentUpcoming';

  constructor(readonly userId: number, readonly appointmentId: number) {}
}
