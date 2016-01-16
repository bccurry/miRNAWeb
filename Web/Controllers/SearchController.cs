using System.Collections.Generic;
using System.Web.Http;
using Data.Dispatchers;
using Data.Models;
using Data.Queries;

namespace Web.Controllers
{
    [RoutePrefix("api/search")]
    public class SearchController : ApiController
    {
        private readonly IQueryDispatcher _qry;
        private readonly ICommandDispatcher _cmd;

        public SearchController(IQueryDispatcher qry, ICommandDispatcher cmd)
        {
            _qry = qry;
            _cmd = cmd;
        }

        
        [Route("getallvectors")]
        [HttpGet]
        public IEnumerable<Vector> GetAllVectors()
        {         
           return _qry.Dispatch(new GetAllVectorsQuery());
        }

        
        [Route("validatesearchterms")]
        [HttpPost]
        public string ValidateSearchTerms()
        {
            return "x";
        }
    }
}
