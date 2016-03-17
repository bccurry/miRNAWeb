using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using Data.Models;

namespace Web.Factories
{
    public interface ILogEntropyFactory
    {
        IEnumerable<LogEntropyResult> HighlightSearchTerms(IEnumerable<LogEntropyResult> logEntropyEnumerable,
            IEnumerable<string> termEnumerable);
    }
    public class LogEntropyFactory: ILogEntropyFactory
    {
        public IEnumerable<LogEntropyResult> HighlightSearchTerms(IEnumerable<LogEntropyResult> logEntropyEnumerable, IEnumerable<string> termEnumerable)
        {
            return logEntropyEnumerable.Select(x => termEnumerable.Contains(x.LogEntropyTerm) ?
            new LogEntropyResult { LogEntropyTerm = "<span style=\"background-color:#76EE00\">" + x.LogEntropyTerm + "</span>"} : x);
        }
    }
}