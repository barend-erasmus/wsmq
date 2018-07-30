export class DesktopNotificationHelper {
  public static async show(image: string, message: string, title: string, url: string): Promise<boolean> {
    if (!('Notification' in window)) {
      return false
    } else if ((Notification as any).permission === 'granted') {
      const notification: Notification = DesktopNotificationHelper.build(image, message, title, url);

      return true;
    } else if ((Notification as any).permission !== 'denied') {
      const granted: boolean = await DesktopNotificationHelper.requestPermission();

      if (!granted) {
        return false;
      }

      return DesktopNotificationHelper.show(image, message, title, url);
    }
  }

  protected static build(image: string, message: string, title: string, url: string): Notification {
    const notification: Notification = new Notification(title, {
      body: message,
      icon: image,
    });

    notification.onclick = () => {
      window.open(url, '_blank');

      notification.close();
    };

    return notification;
  }

  protected static requestPermission(): Promise<boolean> {
    return new Promise((resolve: (result: boolean) => void, reject: (error: Error) => void) => {
      Notification.requestPermission((permission: NotificationPermission) => {
        if (permission === 'granted') {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
}
