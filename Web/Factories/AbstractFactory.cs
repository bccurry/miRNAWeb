﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web;
using Microsoft.Owin.Security.Provider;

namespace Web.Factories
{
    public interface IAbstractFactory
    {
        string BuildAbstractComponent(IEnumerable<string> pmidEnumerable);
        string HighlightSearchTerms(IEnumerable<string> searchEnumerable, string abstractComponent);

    }
    public class AbstractFactory: IAbstractFactory
    {
        public string BuildAbstractComponent(IEnumerable<string> pmidEnumerable)
        {
            var abstractPath = HttpContext.Current.Server.MapPath(@"\Abstracts");
            return BoldAbstractTitle(pmidEnumerable.Select(pmid => $@"{abstractPath}\{pmid}.txt")
                                 .Where(path => File.Exists(path))
                                 .Aggregate(string.Empty, (current, path) => current + "<p>" + File.ReadAllText(path)+ "</p>"));
        }

        private static string BoldAbstractTitle(string abstractComponent)
        {
            string[] delimiters = {"<p>"};
            var formattedAbstractComponent = string.Empty;
            var splitAbstractComponent = abstractComponent.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            foreach (var @abstract in splitAbstractComponent)
            {
                var indexOfPeriod = @abstract.IndexOf(".", StringComparison.Ordinal) + 1;
                formattedAbstractComponent += "<p><b>" + @abstract.Insert(indexOfPeriod, "</b><br/>");
            }
            return formattedAbstractComponent;
        }

        public string HighlightSearchTerms(IEnumerable<string> searchEnumerable, string abstractComponent)
        {
            return searchEnumerable.Aggregate(abstractComponent, (current, item) => current.Replace(item, "<span>" + item + "</span>"));
        }
    }
}