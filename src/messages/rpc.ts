export class RPCMessage {
  constructor(public correlationId: string, public data: any, public senderId: string) {}
}
