# WSMQ Client (C# REST)

```csharp
var host = "http://127.0.0.1:8080/<insert-your-channel-here>";

var message = "<insert-your-message-here>";

var client = new HttpClient();

var response = await client.PostAsync(host, new StringContent(message, Encoding.UTF8 , "application/json"));
```