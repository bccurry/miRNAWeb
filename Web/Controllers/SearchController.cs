using System;
using System.Diagnostics;
using System.Linq;
using System.Web.Http;
using Data.Dispatchers;
using Data.Queries;
using AForge.Math.Metrics;
using Microsoft.AspNet.SignalR;
using Web.Factories;
using Web.Hubs;

namespace Web.Controllers
{
    [RoutePrefix("api/search")]
    public class SearchController : ApiController
    {
        private readonly IQueryDispatcher _qry;
        private readonly ICommandDispatcher _cmd;
        private readonly ISearchFactory _searchFactory;
        private readonly IHubContext _hubContext;
        public SearchController(IQueryDispatcher qry, ICommandDispatcher cmd, ISearchFactory searchFactory)
        {
            _qry = qry;
            _cmd = cmd;
            _searchFactory = searchFactory;
            _hubContext =
                        GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
        }
  
        [Route("")]
        [HttpPost]
        public dynamic ValidateSearchTerms([FromBody]string searchTerms)
        {
            double[] compositeVector = null;
            char[] delimiters = new char[] { '\r', '\n', ';', ',', '|' };
            string[] searchTermEnumerable = searchTerms.Split(delimiters,
                     StringSplitOptions.RemoveEmptyEntries);

            // Assuming only searching for one term at a time right now
            // Also validation step
            var validatedVectorMetaDataEnumerable = searchTermEnumerable.Select(x => _qry.Dispatch(new ValidateSearchTermQuery(x)));

            if (validatedVectorMetaDataEnumerable.Count() == 1)
            {
                var compositeVectorMetaData = validatedVectorMetaDataEnumerable.Single();
                compositeVector =
                    _qry.Dispatch(new VectorByNameAndTypeQuery(compositeVectorMetaData.Name, compositeVectorMetaData.Type)).Values;
            }
            else
            {
                compositeVector = _searchFactory.ComputeCompositeVector(validatedVectorMetaDataEnumerable);
            }       

            // Get all mirna Vector Ids
            var mirnaVectorIds = _qry.Dispatch(new AllVectorMetaDataQuery());
            var mirnaVectorCount = mirnaVectorIds.Count();
            var results = mirnaVectorIds.Select((x, idx) => new
            {
                Name = x.Name,
                Type = x.Type,
                Value = _searchFactory.ComputeCosineSimilarity(compositeVector, _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values, idx, mirnaVectorCount)
            }).OrderByDescending(x => x.Value).Take(50);
            
            return results;
        }

        [Route("test")]
        [HttpGet]
        public dynamic Test()
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();
            var searchTerms = "cancer";
            char[] delimiters = new char[] { '\r', '\n', ';', ',', '|' };
            string[] searchTermEnumerable = searchTerms.Split(delimiters,
                     StringSplitOptions.RemoveEmptyEntries);

            // Assuming only searching for one term at a time right now
            // Also validation step
            var validatedVectorMetaDataEnumerable = searchTermEnumerable.Select(x => _qry.Dispatch(new ValidateSearchTermQuery(x)));
            var compositeVectorMetaData = validatedVectorMetaDataEnumerable.Single();
            var compositeVector =
                _qry.Dispatch(new VectorByNameAndTypeQuery(compositeVectorMetaData.Name, compositeVectorMetaData.Type));

            // Get all mirna Vector Ids
            var mirnaVectorIds = _qry.Dispatch(new AllVectorMetaDataQuery());
            var mirnaVectorCount = mirnaVectorIds.Count();
            var results = mirnaVectorIds.AsParallel().Select((x, idx) => new
            {
                Name = x.Name,
                Type = x.Type,
                Value = _searchFactory.ComputeCosineSimilarity(compositeVector.Values, _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values, idx, mirnaVectorCount)
            }).OrderByDescending(x => x.Value).Take(50);

            stopWatch.Stop();
            var elapsed = stopWatch.ElapsedMilliseconds / 1000;

            return results;
        }
    }
}
