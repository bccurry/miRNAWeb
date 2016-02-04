using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Data.Dispatchers;
using Data.Models;
using Data.Queries;

namespace Web.Factories
{
    public interface IValidationFactory
    {
        IEnumerable<VectorMetaData> ValidateSearchTerms(IEnumerable<string> searchTermEnumerable,
            bool isMirnaAndTermSearch);
    }
    public class ValidationFactory : IValidationFactory
    {
        private readonly IQueryDispatcher _qry;
        public ValidationFactory(IQueryDispatcher qry)
        {
            _qry = qry;
        }
        public IEnumerable<VectorMetaData> ValidateSearchTerms(IEnumerable<string> searchTermEnumerable, bool isMirnaAndTermSearch )
        {
            var validatedVectorMetaDataArray = searchTermEnumerable.Select(x => _qry.Dispatch(new ValidateSearchTermQuery(x))).ToArray();
            if (validatedVectorMetaDataArray.Any(x => x == null))
            {
                throw new SearchTermNotFoundHttpException();
            }
            else if (isMirnaAndTermSearch && validatedVectorMetaDataArray.Any(x => x.Type == "term"))
            {
                throw new MirnaAndTermHttpException();
            }
                
            return validatedVectorMetaDataArray;
        }

    }
}