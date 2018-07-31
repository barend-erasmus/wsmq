import { MessageQueueClient } from '../message-queue-client';
import { DesktopNotificationHelper } from './desktop-notification-helper';
import { ToastrNotificationHelper } from './toastr-notification-helper';

(async () => {
  const host: string = 'ws://127.0.0.1:8080';

  const channels: Array<string> = ['wsmq-demo'];

  const messageQueueClient = new MessageQueueClient(
    host,
    (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
      showNotification(data.image, data.message, data.title, data.url);
    },
    channels,
  );

  await messageQueueClient.connect();
})();

async function showNotification(image: string, message: string, title: string, url: string): Promise<void> {
  const desktopNotificationResult: boolean = await DesktopNotificationHelper.show(image, message, title, url);

  if (!desktopNotificationResult) {
    ToastrNotificationHelper.show(image, message, title, url);
  }
}
