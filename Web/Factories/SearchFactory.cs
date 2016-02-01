﻿using System;
using System.Collections.Generic;
using System.Linq;
using AForge.Math.Metrics;
using Data.Dispatchers;
using Data.Models;
using Data.Queries;
using Microsoft.AspNet.SignalR;
using Web.Hubs;

namespace Web.Factories
{
    public interface ISearchFactory
    {
        double ComputeCosineSimilarity(double[] compositeVector, double[] comparedVector, int index, int total);
        double[] ComputeCompositeVector(IEnumerable<VectorMetaData> searchEnumerable);
        SearchResult ComputeMirnaResultTerms(double[] compositeVector);
        SearchResult ComputeMirnaAndTermResultTerms(double[] compositeVector);
    }

    public class SearchFactory : ISearchFactory
    {
        private readonly IQueryDispatcher _qry;
        private readonly IHubContext _hubContext;
        private readonly CosineSimilarity _cs;

        public SearchFactory(CosineSimilarity cs, QueryDispatcher qry)
        {
            _qry = qry;
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<MessageHub>();
            _cs = cs;
        }

        public double ComputeCosineSimilarity(double[] compositeVector, double[] comparedVector, int current, int total)
        {
            var percentageFinished = ComputePercentageFinished(current, total);
            _hubContext.Clients.All.percentageFinishedClient(percentageFinished);
            return _cs.GetSimilarityScore(compositeVector, comparedVector);
        }

        private int ComputePercentageFinished(double current, double total)
        {
            return (int) (current/(total - 1)*100);
        }

        public double[] ComputeCompositeVector(IEnumerable<VectorMetaData> searchEnumerable)
        {
            var compositeVector = new double[449];
            compositeVector = searchEnumerable.Select(
                searchTerm => _qry.Dispatch(new VectorByNameAndTypeQuery(searchTerm.Name, searchTerm.Type)).Values)
                .Aggregate(compositeVector,
                    (current, searchVector) => current.Zip(searchVector, (x, y) => x + y).ToArray());
            return compositeVector;
        }

        public SearchResult ComputeMirnaResultTerms(double[] compositeVector)
        {
            var mirnaVectorIds = _qry.Dispatch(new AllVectorMetaDataQuery(false)).ToArray();
            var mirnaVectorCount = mirnaVectorIds.Count();
            return new SearchResult {
                MirnaResultTerms = mirnaVectorIds.Select((x, idx) => new ResultTerm
                {
                    Name = x.Name,
                    Type = x.Type,
                    Value =
                        ComputeCosineSimilarity(compositeVector,
                            _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values, idx, mirnaVectorCount)
                }).OrderByDescending(x => x.Value).Take(50)
            };  
        }

        public SearchResult ComputeMirnaAndTermResultTerms(double[] compositeVector)
        {
            var mirnaVectorIds = _qry.Dispatch(new AllVectorMetaDataQuery(false)).ToArray();
            var termVectorIds = _qry.Dispatch(new AllVectorMetaDataQuery(true)).ToArray();
            var totalVectorIdsCount = mirnaVectorIds.Count() + termVectorIds.Count();

            var result = new SearchResult
            {
                MirnaResultTerms = mirnaVectorIds.Select((x, idx) => new ResultTerm
                {
                    Name = x.Name,
                    Type = x.Type,
                    Value =
                        ComputeCosineSimilarity(compositeVector,
                            _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values, idx, totalVectorIdsCount)
                }).OrderByDescending(x => x.Value).Take(50),

                TermResultTerms = termVectorIds.Select((x, idx) => new ResultTerm
                {
                    Name = x.Name,
                    Type = x.Type,
                    Value = ComputeCosineSimilarity(compositeVector, _qry.Dispatch(new VectorByNameAndTypeQuery(x.Name, x.Type)).Values, idx + mirnaVectorIds.Count(), totalVectorIdsCount)
                }).OrderByDescending(x => x.Value).Take(300)
            };

            return result;
        }

    }
}