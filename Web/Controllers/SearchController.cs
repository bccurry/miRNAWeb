using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Data.Dispatchers;
using Data.Queries;
using Data.Models;
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
        private readonly IValidationFactory _validationFactory;
        private readonly IAbstractFactory _abstractFactory;
        private readonly ILogEntropyFactory _logEntropyFactory;
        private readonly IHubContext _hubContext;
        public SearchController(IQueryDispatcher qry, ICommandDispatcher cmd, ISearchFactory searchFactory,
            IValidationFactory validationFactory, IAbstractFactory abstractFactory, ILogEntropyFactory logEntropyFactory)
        {
          
            _qry = qry;
            _cmd = cmd;
            _searchFactory = searchFactory;
            _validationFactory = validationFactory;
            _abstractFactory = abstractFactory;
            _logEntropyFactory = logEntropyFactory;
            _hubContext =
                        GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
        }
  
        [Route("")]
        [HttpPost]
        public SearchResult ProcessSearchRequest(SearchRequest request)
        {         
            var delimiters = new char[] { '\r', '\n', ';', ',', '|', '\t', ' ' };
            var searchTermEnumerable = request.DelimitedSearchTerms.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            var validatedVectorMetaDataArray = _validationFactory.ValidateSearchTerms(searchTermEnumerable, request.IsMirnaAndTermSearch);
            var compositeVector = _searchFactory.ComputeCompositeVector(validatedVectorMetaDataArray);
            var result = request.IsMirnaAndTermSearch ? _searchFactory.ComputeMirnaAndTermResultTerms(compositeVector) 
                : _searchFactory.ComputeMirnaResultTerms(compositeVector);
            result.MirnaResultTerms = _searchFactory.ItalicizeSearchTerms(result.MirnaResultTerms, searchTermEnumerable);
            result.TermResultTerms = request.IsMirnaAndTermSearch ? _searchFactory.ItalicizeSearchTerms(result.TermResultTerms, searchTermEnumerable) : result.TermResultTerms;
            return result;
        }

        [Route("abstracts")]
        [HttpPost]
        public dynamic GetAbstracts(NetworkRequest request)
        {
            var pmidEnumerable = _qry.Dispatch(new AbstractsQuery(request.MirnaEnumerable));
            var abstractComponent = _abstractFactory.BuildAbstractComponent(pmidEnumerable);
            return new
            {
                Abstracts = _abstractFactory.HighlightSearchTerms(request.MirnaEnumerable, abstractComponent, request.TermEnumerable),
                Count = pmidEnumerable.Count()
            };
        }

        [Route("logentropys")]
        [HttpPost]
        public dynamic GetLogEntropys(NetworkRequest request)
        {
            var logEntropyEnumerable = _qry.Dispatch(new LogEntropyQuery(request.MirnaEnumerable));
            return new 
            {
                LogEntropys = _logEntropyFactory.HighlightSearchTerms(logEntropyEnumerable, request.TermEnumerable),
                Count = logEntropyEnumerable.Count()
            };
        }    

    }
}
