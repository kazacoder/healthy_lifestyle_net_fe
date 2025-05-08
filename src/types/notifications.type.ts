export type NotificationsType = {
  receiveNotificationsSite: boolean,
  receiveNotificationsEmail: boolean,
  receiveNotificationsEvents: boolean,
  receiveNotificationsNews: boolean,
  receiveNotificationsBooks: boolean,
  receiveNotificationsQuestions: boolean,
}

export const NotificationMatch: {[key: string]: string} = {
  receiveNotificationsSite: 'receive_notifications_site',
  receiveNotificationsEmail: 'receive_notifications_email',
  receiveNotificationsEvents: 'receive_notifications_events',
  receiveNotificationsNews: 'receive_notifications_news',
  receiveNotificationsBooks: 'receive_notifications_books',
  receiveNotificationsQuestions: 'receive_notifications_questions',
}
