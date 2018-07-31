# WSMQ Client (C#)

```csharp
var host = "ws://127.0.0.1:8080";

var clientWebSocket = new System.Net.WebSockets.ClientWebSocket();

CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
CancellationToken cancellationToken = cancellationTokenSource.Token;

await clientWebSocket.ConnectAsync(new Uri(host), cancellationToken);

var json = Newtonsoft.Json.JsonConvert.SerializeObject(new
{
    channel = "<insert-your-channel-here>",
    data = "<insert-your-message-here>",
    type = "publish"
});

var jsonBytes = Encoding.UTF8.GetBytes(json);

await clientWebSocket.SendAsync(new ArraySegment<byte>(jsonBytes), WebSocketMessageType.Text, true, cancellationToken);
```