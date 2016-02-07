using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Data.Dispatchers;
using Data.Queries;
using AForge.Math.Metrics;
using Data.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Security.Provider;
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
        private readonly IValidationFactory _validationFactory;
        private readonly IAbstractFactory _abstractFactory;
        private readonly IHubContext _hubContext;
        public SearchController(IQueryDispatcher qry, ICommandDispatcher cmd, ISearchFactory searchFactory,
            IValidationFactory validationFactory, IAbstractFactory abstractFactory)
        {
            _qry = qry;
            _cmd = cmd;
            _searchFactory = searchFactory;
            _validationFactory = validationFactory;
            _abstractFactory = abstractFactory;
            _hubContext =
                        GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
        }
  
        [Route("")]
        [HttpPost]
        public SearchResult ProcessSearchRequest(SearchRequest request)
        {         
            var delimiters = new char[] { '\r', '\n', ';', ',', '|' };
            var searchTermEnumerable = request.DelimitedSearchTerms.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            var validatedVectorMetaDataArray = _validationFactory.ValidateSearchTerms(searchTermEnumerable, request.IsMirnaAndTermSearch);
            var compositeVector = _searchFactory.ComputeCompositeVector(validatedVectorMetaDataArray);
            return request.IsMirnaAndTermSearch ? _searchFactory.ComputeMirnaAndTermResultTerms(compositeVector) 
                : _searchFactory.ComputeMirnaResultTerms(compositeVector);
        }

        [Route("abstracts")]
        [HttpPost]
        public string GetAbstracts(IEnumerable<string> requestEnumerable)
        {
            var pmidEnumerable = _qry.Dispatch(new AbstractsQuery(requestEnumerable));
            return _abstractFactory.BuildAbstractComponent(pmidEnumerable);
        }

    }
}
