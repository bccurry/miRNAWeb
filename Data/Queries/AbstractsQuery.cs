using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using Data.Dispatchers;
using Data.Gateways;
using Data.Models;

namespace Data.Queries
{
    public class AbstractsQuery: IQuery<IEnumerable<string>>
    {
        private IEnumerable<string> SearchEnumerable { get; set; }

        public AbstractsQuery(IEnumerable<string> searchEnumerable)
        {
            SearchEnumerable = searchEnumerable;
        }

        public IEnumerable<string> Retrieve()
        {
            using (IDbConnection connection = new SqlConnection(MirnaGateway.Connection))
            {
                const string query = @"SELECT Pmid FROM Abstract WHERE Symbol IN @SearchEnumerable ORDER BY Pmid DESC";
                var result = connection.Query<string>(query, new { SearchEnumerable }).ToList();
                return SearchEnumerable.Count() > 1 ? result.GroupBy(x => x)
                                                                   .Where(g => g.Count() == SearchEnumerable.Count())
                                                                   .Select(g => g.Key) 
                                                           : result;
            }
        }
    }
}
