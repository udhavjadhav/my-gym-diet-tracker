import { LocalNotifications } from '@capacitor/local-notifications';

export class NotificationService {
  static async requestPermissions() {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleGymReminders() {
    try {
      // Cancel existing gym reminders
      for (let day = 1; day <= 6; day++) {
        await LocalNotifications.cancel({ notifications: [{ id: day }] });
      }

      // Schedule daily gym reminder at 6:15 PM (except Sunday)
      const notifications = [];
      for (let day = 1; day <= 6; day++) { // Monday (1) to Saturday (6)
        notifications.push({
          title: "It's gym time! 💪",
          body: "Time to hit the gym and crush your workout!",
          id: day,
          schedule: {
            on: {
              weekday: day,
              hour: 18,
              minute: 15
            },
            repeats: true
          },
          sound: 'default',
          actionTypeId: '',
          extra: null
        });
      }

      await LocalNotifications.schedule({ notifications });
      return true;
    } catch (error) {
      console.error('Error scheduling gym reminders:', error);
      return false;
    }
  }

  static async cancelGymReminders() {
    try {
      const notifications = [];
      for (let day = 1; day <= 6; day++) {
        notifications.push({ id: day });
      }
      await LocalNotifications.cancel({ notifications });
    } catch (error) {
      console.error('Error canceling gym reminders:', error);
    }
  }
}