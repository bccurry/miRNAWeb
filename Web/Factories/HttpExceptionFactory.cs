using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Web.Factories
{
    public class MirnaAndTermHttpResponse: HttpResponseMessage
    {
        public MirnaAndTermHttpResponse() : base(HttpStatusCode.BadRequest)
        {
            Content = new StringContent("Cannot process MiRNA & Term Search because there are terms in the search list.");
            ReasonPhrase = "Bad Request (Cannot Process MiRNA & Term Search)";
        }
    }

    public class SearchTermNotFoundHttpResponse : HttpResponseMessage
    {
        public SearchTermNotFoundHttpResponse() : base(HttpStatusCode.BadRequest)
        {
            Content = new StringContent("Cannot process search because there are invalid search term(s) in the search list.");
            ReasonPhrase = "Bad Request (Invalid Search Term(s))";
        }
    }

    public class MirnaAndTermHttpException : HttpResponseException
    {
        public MirnaAndTermHttpException() :base(new MirnaAndTermHttpResponse())
        { }
    }

    public class SearchTermNotFoundHttpException : HttpResponseException
    {
        public SearchTermNotFoundHttpException() : base(new SearchTermNotFoundHttpResponse())
        { }
    }

}