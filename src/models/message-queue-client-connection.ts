export class MessageQueueClientConnection {

    constructor(
        public socket: any,
        public subscribedChannels: string[],
    ) {

    }

    public subscribe(channel: string): void {
        this.subscribedChannels.push(channel);
    }

}
