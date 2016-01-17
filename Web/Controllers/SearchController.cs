using System;
using System.Collections.Generic;
using System.Linq;
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
        public string ValidateSearchTerms([FromBody]string searchTermList)
        {
            char[] delimiters = new char[] { '\r', '\n', ';', ',' };
            string[] searchTermArray = searchTermList.Split(delimiters,
                     StringSplitOptions.RemoveEmptyEntries);

            var resultArray = searchTermArray.Select(x => new { Term = x,
                Availiable = _qry.Dispatch(new ValidateSearchTermQuery(x)) });

            return resultArray.Any(x => x.Availiable == false) ? "ERROR" : null;
        }
    }
}
