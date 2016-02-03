﻿using System;
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
        public SearchResult ProcessSearchRequest(SearchRequest request)
        {
            
            var delimiters = new char[] { '\r', '\n', ';', ',', '|' };
            var searchTermEnumerable = request.DelimitedSearchTerms.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            var validatedVectorMetaDataArray = searchTermEnumerable.Select(x => _qry.Dispatch(new ValidateSearchTermQuery(x))).ToArray();
            if (request.IsMirnaAndTermSearch)
            {
                if (validatedVectorMetaDataArray.Any(vectorMetaData => vectorMetaData.Type == "term"))
                {
                    var resp = new HttpResponseMessage(HttpStatusCode.BadRequest)
                    {
                        Content = new StringContent("Cannot process MiRNA & Term Search because there are terms in the search list."),
                        ReasonPhrase = "Bad Request (Cannot Process MiRNA & Term Search)"
                    };
                    throw new HttpResponseException(resp);
                }
            }
            
            var compositeVector = _searchFactory.ComputeCompositeVector(validatedVectorMetaDataArray);
            return request.IsMirnaAndTermSearch ? _searchFactory.ComputeMirnaAndTermResultTerms(compositeVector) 
                : _searchFactory.ComputeMirnaResultTerms(compositeVector);
        }

    }
}
