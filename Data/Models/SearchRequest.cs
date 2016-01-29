using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class SearchRequest
    {
        public string DelimitedSearchTerms { get; set; }
        public bool IsMirnaAndTermSearch { get; set; }
    }
}
