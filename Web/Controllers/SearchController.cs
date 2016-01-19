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
  
        [Route("validatesearchterms")]
        [HttpPost]
        public void ValidateSearchTerms([FromBody]string searchTermList)
        {
            char[] delimiters = new char[] { '\r', '\n', ';', ',', '|' };
            string[] searchTermArray = searchTermList.Split(delimiters,
                     StringSplitOptions.RemoveEmptyEntries);

            var resultArray = searchTermArray.Select(x => _qry.Dispatch(new ValidateSearchTermQuery(x)));
            var mirnaVectorIds = _qry.Dispatch(new AllVectorIdsQuery());

            foreach (var result in resultArray)
            {
               
            }

        }

        
    }
}
