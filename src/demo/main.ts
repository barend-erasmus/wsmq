import { MessageQueueClient } from '../message-queue-client';
import { DesktopNotificationHelper } from './desktop-notification-helper';
import { ToastrNotificationHelper } from './toastr-notification-helper';

(async () => {
  const messageQueueClient = new MessageQueueClient(
    'ws://127.0.0.1:8080',
    (channel: string, data: any, messageQueueClient: MessageQueueClient) => {
      showNotification(data.image, data.message, data.title, data.url);
    },
    ['wsmq-demo'],
  );

  await messageQueueClient.connect();

  // For demo purposes only...
  setTimeout(() => {
    messageQueueClient.send('wsmq-demo', {
      // image: 'http://via.placeholder.com/150x150',
      image:
        'http://styleguide.euromonitor.com/assets/images/brand-guide/euromonitor/the-signature/alternate-symbol.png',
      message: `The file you created called 'Alcoholic Drink March 2018' is now available. You can download it from your Downloads page in the My Content area of Passport.`,
      title: 'Download now available',
      url: 'http://www.euromonitor.com',
    });
  }, 5000);
})();

async function showNotification(image: string, message: string, title: string, url: string): Promise<void> {
  const desktopNotificationResult: boolean = await DesktopNotificationHelper.show(image, message, title, url);

  if (!desktopNotificationResult) {
    ToastrNotificationHelper.show(image, message, title, url);
  }
}
