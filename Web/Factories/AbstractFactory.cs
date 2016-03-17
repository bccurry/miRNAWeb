using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using Microsoft.Owin.Security.Provider;

namespace Web.Factories
{
    public interface IAbstractFactory
    {
        string BuildAbstractComponent(IEnumerable<string> pmidEnumerable);
        string HighlightSearchTerms(IEnumerable<string> searchEnumerable, string abstractComponent, IEnumerable<string> termEnumerable);

    }
    public class AbstractFactory: IAbstractFactory
    {
        public string BuildAbstractComponent(IEnumerable<string> pmidEnumerable)
        {
            var abstractPath = HttpContext.Current.Server.MapPath(@"\Abstracts");
            return BoldAbstractTitle(pmidEnumerable.Select(pmid => $@"{abstractPath}\{pmid}.txt")
                                 .Where(path => File.Exists(path))
                                 .Aggregate(string.Empty, (current, path) => current + "<p>" + path.Substring(path.LastIndexOf(@"\", StringComparison.Ordinal) + 1, (path.IndexOf(".", StringComparison.Ordinal) -1) - path.LastIndexOf(@"\", StringComparison.Ordinal)) + "|" + File.ReadAllText(path)+ "</p>"));
        }

        private static string BoldAbstractTitle(string abstractComponent)
        {
            string[] delimiters = {"<p>"};
            var formattedAbstractComponent = string.Empty;
            var splitAbstractComponent = abstractComponent.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
            foreach (var @abstract in splitAbstractComponent)
            {
                var indexOfPeriod = @abstract.IndexOf(".", StringComparison.Ordinal) + 1;
                var pmid = @abstract.Substring(0, @abstract.IndexOf("|", StringComparison.Ordinal));
                var tempAbstract = "<p><b><a target=\"_blank\" href> " + @abstract.Insert(indexOfPeriod, "</a></b><br/>");

                formattedAbstractComponent += tempAbstract.Replace(pmid + "|", "").Replace("href", "href=\"http://www.ncbi.nlm.nih.gov/pubmed/" + pmid + "\"");
            }
            return formattedAbstractComponent;
        }

        public string HighlightSearchTerms(IEnumerable<string> searchEnumerable, string abstractComponent, IEnumerable<string> termEnumerable)
        {
            var result = abstractComponent.Any() ? searchEnumerable.Select(term => term.Substring(4))
                .Aggregate(abstractComponent, (current, regexTerm) => 
                Regex.Replace(current, regexTerm, "<span style=\"background-color:yellow\">" + regexTerm + "</span>", RegexOptions.IgnoreCase)) :
                null;

            return result != null
                ? termEnumerable
                    .Aggregate(result, (current, regexTerm) =>
                        Regex.Replace(current, regexTerm,
                            "<span style=\"background-color:#76EE00\">" + regexTerm + "</span>", RegexOptions.IgnoreCase))
                : null;
        }
    }
}