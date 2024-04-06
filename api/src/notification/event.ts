export class NotifyReviewCommentedEvent {
  static readonly EVENT_NAME = 'notification.reviewCommented';

  constructor(
    readonly userId: number,
    readonly reviewId: number,
    readonly commentId: number,
  ) {}
}

export class NotifyAppointmentUpcommingEvent {
  static readonly EVENT_NAME = 'notification.appointmentUpcoming';

  constructor(readonly userId: number, readonly appointmentId: number) {}
}
