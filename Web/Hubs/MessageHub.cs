using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Web.Hubs
{
    public interface IMessageHub 
    {
        Func<int, bool> UpdatePercentageFinished { get; set; }
    }

    public class MessageHub : Hub, IMessageHub
    {
        public Func<int, bool> UpdatePercentageFinished { get; set; }

        public void GreetAll()
        {
            var xxxxx = "";
        }
    }
}