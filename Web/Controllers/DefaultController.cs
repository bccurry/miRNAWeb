using System.Collections.Generic;
using System.Web.Http;
using Data.Dispatchers;
using Data.Models;
using Data.Queries;

namespace Web.Controllers
{
    [RoutePrefix("default")]
    public class DefaultController : ApiController
    {
        private readonly IQueryDispatcher _qry;
        private readonly ICommandDispatcher _cmd;

        public DefaultController(IQueryDispatcher qry, ICommandDispatcher cmd)
        {
            _qry = qry;
            _cmd = cmd;
        }

        [HttpGet]
        [Route("getallvectors")]
        public IEnumerable<Vector> GetAllVectors()
        {         
           return _qry.Dispatch(new GetAllVectorsQuery());
        }
    }
}
