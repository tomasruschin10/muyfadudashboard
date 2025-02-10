export interface Notification {
  id: number;
  title: string;
  description: string;
  date: Date | null;
  sent: boolean
}

export type NotificationPayload = Omit<Notification, 'id'>;