using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class SearchResult
    {
        public IEnumerable<ResultTerm> MirnaResultTerms { get; set; } 
        public IEnumerable<ResultTerm> TermResultTerms { get; set; }
        public int MirnaResultTermsCount { get; set; }
        public int TermsResultTermsCount { get; set; }
    }
}
