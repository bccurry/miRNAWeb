using AForge.Math.Metrics;
using Microsoft.AspNet.SignalR;
using Web.Hubs;

namespace Web.Factories
{
    public interface ISearchFactory
    {
        double ComputeCosineSimilarity(double[] compositeVector, double[] comparedVector, int index, int total);
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

        public double ComputeCosineSimilarity(double[] compositeVector, double [] comparedVector, int current, int total)
        {
//            _messageHub.UpdatePercentageFinished(22222);
            var percentageFinished = ComputePercentageFinished(current, total);
            _hubContext.Clients.All.percentageFinishedClient(percentageFinished);
            return _cs.GetSimilarityScore(compositeVector, comparedVector);
        }

        public double ComputePercentageFinished(double current, double total)
        {
            return current / total;
        }
    }
}