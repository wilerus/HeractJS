using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using WebSocketManager;
using WebSocketManager.Common;

namespace TestTs
{
    public class NotificationsHandler : WebSocketHandler
    {
        const string testId = "module:chatik";

        public NotificationsHandler(WebSocketConnectionManager webSocketConnectionManager)
            : base(webSocketConnectionManager)
        {
        }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);

            var socketId = WebSocketConnectionManager.GetId(socket);

            var message = new Message()
            {
                MessageType = MessageType.Text,
                Data = new MessageData
                {
                    Message = $"{socketId} is now connected",
                    DateTime = DateTime.Now.ToLongDateString()
                },
                Id = testId
            };

            await SendMessageToAllAsync(message);
        }

        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);
            var message = new Message()
            {
                MessageType = MessageType.Text,
                Data = new MessageData
                {
                    Message = $"{socketId} said: {Encoding.UTF8.GetString(buffer, 0, result.Count)}",
                    DateTime = DateTime.Now.ToLongDateString()
                },
                Id = testId
            };

            await SendMessageToAllAsync(message).ConfigureAwait(false);
        }

        public override async Task OnDisconnected(WebSocket socket)
        {
            var socketId = WebSocketConnectionManager.GetId(socket);

            await base.OnDisconnected(socket);

            var message = new Message()
            {
                MessageType = MessageType.Text,
                Data = new MessageData
                {
                    Message = $"{socketId} disconnected",
                    DateTime = DateTime.Now.ToLongDateString()
                },
                Id = testId
            };
            await SendMessageToAllAsync(message).ConfigureAwait(false);
        }
    }
}
