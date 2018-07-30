(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.WSMQDemo = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const publish_1 = require("../commands/publish");
const subscribe_1 = require("../commands/subscribe");
class CommandBuilder {
    constructor() { }
    build(obj) {
        switch (obj.type) {
            case 'publish':
                return new publish_1.PublishCommand(obj.channel, obj.data);
            case 'subscribe':
                return new subscribe_1.SubscribeCommand(obj.channel);
            default:
                throw new Error('Unsupported Command');
        }
    }
}
exports.CommandBuilder = CommandBuilder;

},{"../commands/publish":4,"../commands/subscribe":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(channel, type) {
        this.channel = channel;
        this.type = type;
    }
}
exports.Command = Command;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
class PublishCommand extends command_1.Command {
    constructor(channel, data) {
        super(channel, 'publish');
        this.data = data;
    }
}
exports.PublishCommand = PublishCommand;

},{"./command":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
class SubscribeCommand extends command_1.Command {
    constructor(channel) {
        super(channel, 'subscribe');
    }
}
exports.SubscribeCommand = SubscribeCommand;

},{"./command":3}],6:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class DesktopNotificationHelper {
    static show(image, message, title, url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!('Notification' in window)) {
                return false;
            }
            else if (Notification.permission === 'granted') {
                const notification = DesktopNotificationHelper.build(image, message, title, url);
                return true;
            }
            else if (Notification.permission !== 'denied') {
                const granted = yield DesktopNotificationHelper.requestPermission();
                if (!granted) {
                    return false;
                }
                return DesktopNotificationHelper.show(image, message, title, url);
            }
        });
    }
    static build(image, message, title, url) {
        const notification = new Notification(title, {
            body: message,
            icon: image,
        });
        notification.onclick = () => {
            window.open(url, '_blank');
            notification.close();
        };
        return notification;
    }
    static requestPermission() {
        return new Promise((resolve, reject) => {
            Notification.requestPermission((permission) => {
                if (permission === 'granted') {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        });
    }
}
exports.DesktopNotificationHelper = DesktopNotificationHelper;

},{}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_queue_client_1 = require("../message-queue-client");
const desktop_notification_helper_1 = require("./desktop-notification-helper");
(() => __awaiter(this, void 0, void 0, function* () {
    const messageQueueClient = new message_queue_client_1.MessageQueueClient('ws://127.0.0.1:8080', (channel, data, messageQueueClient) => {
        showNotification(data.image, data.message, data.title, data.url);
    }, ['wsmq-demo']);
    yield messageQueueClient.connect();
    setTimeout(() => {
        messageQueueClient.send('wsmq-demo', {
            image: 'http://styleguide.euromonitor.com/assets/images/brand-guide/euromonitor/the-signature/alternate-symbol.png',
            message: `The file you created called 'Alcoholic Drink March 2018' is now available. You can download it from your Downloads page in the My Content area of Passport.`,
            title: 'Download now available',
            url: 'http://www.euromonitor.com',
        });
    }, 5000);
}))();
function showNotification(image, message, title, url) {
    desktop_notification_helper_1.DesktopNotificationHelper.show(image, message, title, url);
}

},{"../message-queue-client":8,"./desktop-notification-helper":6}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WS = require("ws");
const command_builder_1 = require("./builders/command-builder");
const publish_1 = require("./commands/publish");
const subscribe_1 = require("./commands/subscribe");
class MessageQueueClient {
    constructor(host, onMessageFn, subscribedChannels) {
        this.host = host;
        this.onMessageFn = onMessageFn;
        this.subscribedChannels = subscribedChannels;
        this.socket = null;
    }
    connect() {
        return new Promise((resolve, reject) => {
            this.socket = typeof WebSocket === 'undefined' ? new WS(this.host) : new WebSocket(this.host);
            this.socket.onclose = (closeEvent) => this.onClose(closeEvent);
            this.socket.onmessage = (event) => this.onMessage(event);
            this.socket.onopen = (openEvent) => this.onOpen(openEvent, resolve);
        });
    }
    send(channel, data) {
        this.socket.send(JSON.stringify(new publish_1.PublishCommand(channel, data)));
    }
    onClose(closeEvent) {
        if (closeEvent.code === 1000) {
            return;
        }
        this.connect();
    }
    onMessage(event) {
        const commandBuilder = new command_builder_1.CommandBuilder();
        const command = commandBuilder.build(JSON.parse(event.data));
        if (command instanceof publish_1.PublishCommand) {
            const publishCommand = command;
            if (this.onMessageFn) {
                this.onMessageFn(publishCommand.channel, publishCommand.data, this);
            }
        }
    }
    onOpen(event, callback) {
        if (this.socket.readyState === 1) {
            for (const channel of this.subscribedChannels) {
                const subscribeCommand = new subscribe_1.SubscribeCommand(channel);
                this.socket.send(JSON.stringify(subscribeCommand));
            }
            callback();
        }
    }
}
exports.MessageQueueClient = MessageQueueClient;

},{"./builders/command-builder":2,"./commands/publish":4,"./commands/subscribe":5,"ws":1}]},{},[7])(7)
});
