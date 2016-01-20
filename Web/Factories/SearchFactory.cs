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
        private readonly IMessageHub _messageHub;
        private readonly CosineSimilarity _cs;

        public SearchFactory(CosineSimilarity cs, IMessageHub messageHub)
        {
            _messageHub = messageHub;
            _cs = cs;
        }

        public double ComputeCosineSimilarity(double[] compositeVector, double [] comparedVector)
        {
            _messageHub.UpdateProfileRequestAction(1);
            return _cs.GetSimilarityScore(compositeVector, comparedVector);
        }
    }
}