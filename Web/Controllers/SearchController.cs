using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Web.Http;
using Data.Dispatchers;
using Data.Models;
using Data.Queries;
using AForge.Math.Metrics;

namespace Web.Controllers
{
    [RoutePrefix("api/search")]
    public class SearchController : ApiController
    {
        private readonly IQueryDispatcher _qry;
        private readonly ICommandDispatcher _cmd;
        private readonly CosineSimilarity _cs;

        public SearchController(IQueryDispatcher qry, ICommandDispatcher cmd, CosineSimilarity cs)
        {
            _qry = qry;
            _cmd = cmd;
            _cs = cs;
        }
  
        [Route("")]
        [HttpPost]
        public void ValidateSearchTerms([FromBody]string searchTerms)
        {
            var stopWatch = new Stopwatch();
            stopWatch.Start();

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
            
            var results = mirnaVectorIds.AsParallel().Select(x => new
            {
                Name = x.Name,
                Type = x.Type,
                Value = _cs.GetSimilarityScore(compositeVector.Values, _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values)
            }).OrderByDescending(x => x.Value).Take(50);

            stopWatch.Stop();
            var elapsed = stopWatch.ElapsedMilliseconds/1000;

            var yyyy = "";
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

            var results = mirnaVectorIds.AsParallel().Select(x => new
            {
                Name = x.Name,
                Type = x.Type,
                Value = _cs.GetSimilarityScore(compositeVector.Values, _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values)
            }).OrderByDescending(x => x.Value).Take(50);

            stopWatch.Stop();
            var elapsed = stopWatch.ElapsedMilliseconds / 1000;

            return results;
        }

        
    }
}
