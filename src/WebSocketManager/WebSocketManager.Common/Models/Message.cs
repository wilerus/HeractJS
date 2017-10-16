namespace WebSocketManager.Common
{
    public enum MessageType
    {
        Text,
        ConnectionEvent
    }

    public struct Message
    {
        public MessageType MessageType { get; set; }

        public MessageData Data { get; set; }

        public string Id { get; set; }
    }

    public struct MessageData
    {
        public string Message { get; set; }

        public string UserName { get; set; }

        public string DateTime { get; set; }
    }
}