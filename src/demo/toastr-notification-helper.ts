import * as jquery from 'jquery';
import * as toastr from 'toastr';

export class ToastrNotificationHelper {
  public static show(image: string, message: string, title: string, url: string): void {
    toastr.info(message, title, {
        onclick: () => {
            window.open(url, '_blank');
        },
    });
  }
}
