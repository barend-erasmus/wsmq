import * as uuid from 'uuid';
import { MessageQueueClient } from '.';
import { RPCMessage } from './messages/rpc';

export class RPCMessageQueueClient {

    protected correlationActions: {} = null;

    protected messageQueueClient: MessageQueueClient = null;

    protected requestTimeout: number = 2000;

    constructor(
        protected channel: string,
        protected host: string,
        protected id: string,
        protected onMessageFn: (message: RPCMessage) => Promise<any>,
    ) {
        this.correlationActions = {};
    }

    public async connect(): Promise<void> {
        this.messageQueueClient = new MessageQueueClient(
            this.host,
            async (channel: string, data: any, messageQueueClient: MessageQueueClient) => this.onMessage(channel, data, messageQueueClient), [
                `rpc-${this.channel}-${this.id}`,
            ]);

        await this.messageQueueClient.connect();
    }

    public send(data: any, id: string): Promise<any> {
        return new Promise((resolve: () => void, reject: (error: Error) => void) => {
            const rpcMessage: RPCMessage = new RPCMessage(uuid.v4(), data, this.id);

            this.correlationActions[rpcMessage.correlationId] = {
                reject,
                resolve,
            };

            this.messageQueueClient.send(`rpc-${this.channel}-${id}`, rpcMessage);

            this.setTimeoutForCorrelationAction(rpcMessage.correlationId);
        });
    }

    protected hasCorrelationAction(correlationId: string): boolean {
        return this.correlationActions[correlationId] ? true : false;
    }

    protected onMessage(channel: string, data: any, messageQueueClient: MessageQueueClient): void {
        const rpcMessage: RPCMessage = new RPCMessage(data.correlationId, data.data, data.senderId);

        if (this.hasCorrelationAction(rpcMessage.correlationId)) {
            const action: {
                reject: (error: Error) => void,
                resolve: (data: any) => void,
            } = this.correlationActions[rpcMessage.correlationId];

            if (action.resolve) {
                action.resolve(rpcMessage.data);
            }

            delete this.correlationActions[rpcMessage.correlationId];
        } else {
            this.onMessageFn(rpcMessage).then((response: any) => {
                this.messageQueueClient.send(`rpc-${this.channel}-${rpcMessage.senderId}`, new RPCMessage(rpcMessage.correlationId, response, this.id));
            });
        }
    }

    protected setTimeoutForCorrelationAction(correlationId: string): void {
        setTimeout(() => {
            if (this.hasCorrelationAction(correlationId)) {
                const action: {
                    reject: (error: Error) => void,
                    resolve: (data: any) => void,
                } = this.correlationActions[correlationId];

                if (action.reject) {
                    action.reject(new Error('TIMEOUT'));
                }

                this.correlationActions[correlationId].reject = undefined;
                this.correlationActions[correlationId].resolve = undefined;
            }
        }, this.requestTimeout);
    }

}
