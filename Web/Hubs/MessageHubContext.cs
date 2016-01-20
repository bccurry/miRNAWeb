using Microsoft.AspNet.SignalR;

namespace Web.Hubs
{
    public class MessageHubContext : IHubContext
    {
        public Microsoft.AspNet.SignalR.Hubs.IHubConnectionContext<dynamic> Clients { get; set; }
        public IGroupManager Groups { get; set; }
    }
}