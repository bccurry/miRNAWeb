using AForge.Math.Metrics;
using Microsoft.AspNet.SignalR;
using Web.Hubs;

namespace Web.Factories
{
    public interface ISearchFactory
    {
        double ComputeCosineSimilarity(double[] compositeVector, double[] comparedVector);
    }

    public class SearchFactory: ISearchFactory
    {
//        private readonly IMessageHub _messageHub;
        private readonly IHubContext _hubContext;
        private readonly CosineSimilarity _cs;

        public SearchFactory(CosineSimilarity cs)
        {
//            _messageHub = messageHub;
_hubContext =
                        GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
                          
            _cs = cs;
        }

        public double ComputeCosineSimilarity(double[] compositeVector, double [] comparedVector)
        {
//            _messageHub.UpdatePercentageFinished(22222);
            _hubContext.Clients.All.percentageFinishedClient("2222");
            return _cs.GetSimilarityScore(compositeVector, comparedVector);
        }
    }
}