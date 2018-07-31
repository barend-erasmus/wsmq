export class DomainEvents {

    public static onConnect(host: string): void {
        console.log(`connected to ${host}`);
    }

    public static onConnectFailure(host: string): void {
        console.log(`failed to connect to ${host}`);
    }

    public static onDisconnect(host: string): void {
        console.log(`disconnected from ${host}`);
    }

    public static onPublishCommandRecieved(host: string, channel: string, data: any): void {
        console.log(`received publish command from ${host} on channel ${channel}`);
    }

    public static onReconnect(host: string): void {
        console.log(`reconnecting to ${host}`);
    }

    public static onPublishCommandSent(host: string, channel: string, data: any): void {
        console.log(`sent publish command to ${host} on channel ${channel}`);
    }

    public static onSubscribeCommandSent(host: string, channel: string): void {
        console.log(`sent subscribe command to ${host} on channel ${channel}`);
    }

}
